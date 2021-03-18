import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import moment from 'moment';
import { VestMagnetDefinition } from '../../types/magnet';
import { Operation, Transaction, TxnParser } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';
import { getErc20ApproveTxn, maybeParseErc20ApprovalTxn } from './erc20';

export const getVestTxn = (magnet: VestMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const start = magnet.startTime.unix();
  const end = magnet.endTime.unix();
  const duration = end - start;
  const durationToCliff = magnet.cliffTime.unix() - start;
  if (duration <= 0 ||  duration <= durationToCliff) {
    throw Error(`Transaction Error: Invalid Times for Vest Contract start:${start} end:${end} cliff:${magnet.cliffTime.unix()}`);
  }

  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  const contract = contractManager.getYVestFactoryContract();

  return [
    // Approve ERC20
    getErc20ApproveTxn(magnet.token, contract.address, magnet.lifetimeValue, web3),
    // Create Vest Contract
    {
      operation: Operation.CALL,
      to: contract.address,
      value: Transaction.DEFAULT_VALUE,
      data: contract.interface.encodeFunctionData("deploy_vesting_contract(address,address,uint256,uint256,uint256,uint256)", [
        magnet.token.address,   // yVestFactory.token (address)
        magnet.recipient,       // yVestFactory.recipient (address)
        magnet.lifetimeValue,   // yVestFactory.amount (uint256)
        duration,               // yVestFactory.vesting_duration (uint256)
        start,                  // yVestFactory.vesting_start (uint256)
        durationToCliff         // yVestFactory.cliff_length (uint256)
      ])
    }
  ];
}


export const maybeParseVestTxn : TxnParser<VestMagnetDefinition> = (txns, chainId) => {
  const contractManager = getContractManager(chainId);
  if (txns == null || txns.length < 2 || contractManager == null || txns[1].to !== contractManager.contractAddresses.yVestFactoryContractAddress) {
    return null;
  }
  const approveTxn = txns[0];
  const mintTxn = txns[1];

  try {
    const [
      tokenAddress,    // yVestFactory.token (address)
      recipient,       // yVestFactory.recipient (address)
      lifetimeValue,   // yVestFactory.amount (uint256)
      duration,        // yVestFactory.vesting_duration (uint256)
      startTime,       // yVestFactory.vesting_start (uint256)
      durationToCliff  // yVestFactory.cliff_length (uint256)
    ] = contractManager.getSablierContract().interface.decodeFunctionData(
      "deploy_vesting_contract(address,address,uint256,uint256,uint256,uint256)",
      mintTxn.data
    );

    //Validate parse
    if (
      !isAddress(tokenAddress) ||
      !isAddress(recipient) ||
      !BigNumber.isBigNumber(lifetimeValue) ||
      !BigNumber.isBigNumber(duration) ||
      !BigNumber.isBigNumber(startTime) ||
      !BigNumber.isBigNumber(durationToCliff) ||
      duration.lt(0) ||
      durationToCliff.lt(0) ||
      duration.lt(durationToCliff)
    ) {
      return null;
    }

    const parsedToken = maybeParseErc20ApprovalTxn(approveTxn, chainId);

    if (
      parsedToken == null ||
      parsedToken.token.address != tokenAddress ||
      !parsedToken.decimalAmount.eq(lifetimeValue) ||
      // Note: this final check may break if strings aren't formatted the same
      parsedToken.spenderAddress === contractManager.contractAddresses.yVestFactoryContractAddress
    ) {
      return null;
    }

    return {
      magnets: [{
        type: "vest",
        recipient,
        lifetimeValue,
        token: parsedToken.token,
        startTime: moment.unix(startTime.toNumber()),
        cliffTime: moment.unix(startTime.add(durationToCliff).toNumber()),
        endTime: moment.unix(startTime.add(duration).toNumber())
      }],
      rest: txns.slice(2)
    }

  } catch (e) {
    console.error("Error parsing yVestFactory Magnet");
    console.error(e);
    return null;
  }
}
