import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import moment from 'moment';
import { StreamMagnetDefinition } from '../../types/magnet';
import { Operation, Transaction, TxnParser } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';
import { getErc20ApproveTxn, maybeParseErc20ApprovalTxn } from './erc20';

export const getStreamTxn = (magnet: StreamMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  const contract = contractManager.getSablierContract();

  return [
    // ERC20 Approve
    getErc20ApproveTxn(magnet.token, contract.address, magnet.lifetimeValue, web3),
    // Sablier Create Stream
    {
      operation: Operation.CALL,
      to: contract.address,
      value: Transaction.DEFAULT_VALUE,
      data: contract.interface.encodeFunctionData("createStream", [
        magnet.recipient,       // sablier.recipient (address)
        magnet.lifetimeValue,   // sablier.deposit (uint256)
        magnet.token.address,   // sablier.tokenAddress (address)
        magnet.startTime.unix(),// sablier.startTime (uint256)
        magnet.endTime.unix()   // sablier.stopTime (uint256)
      ])
    }
  ];
}

export const maybeParseStreamTxn : TxnParser<StreamMagnetDefinition> = (txns, chainId) => {
  const contractManager = getContractManager(chainId);
  if (txns == null || txns.length < 2 || contractManager == null || txns[1].to !== contractManager.contractAddresses.sablierContractAddress) {
    return null;
  }
  const approveTxn = txns[0];
  const mintTxn = txns[1];

  try {
    const [
      recipient,       // sablier.recipient (address)
      lifetimeValue,   // sablier.deposit (uint256)
      tokenAddress,    // sablier.tokenAddress (address)
      startTime,       // sablier.startTime (uint256)
      stopTime         // sablier.startTime (uint256)
    ] = contractManager.getSablierContract().interface.decodeFunctionData("createStream", mintTxn.data);

    //Validate parse
    if (
      !isAddress(recipient) ||
      !BigNumber.isBigNumber(lifetimeValue) ||
      !isAddress(tokenAddress) ||
      !BigNumber.isBigNumber(startTime) ||
      !BigNumber.isBigNumber(stopTime) ||
      !startTime.lte(stopTime)
    ) {
      return null;
    }

    const parsedToken = maybeParseErc20ApprovalTxn(approveTxn, chainId);

    if (
      parsedToken == null ||
      parsedToken.token.address != tokenAddress ||
      !parsedToken.decimalAmount.eq(lifetimeValue) ||
      // Note: this final check may break if strings aren't formatted the same
      parsedToken.spenderAddress === contractManager.contractAddresses.sablierContractAddress
    ) {
      return null;
    }

    return {
      magnets: [{
        type: "stream",
        recipient,
        lifetimeValue,
        token: parsedToken.token,
        startTime: moment.unix(startTime.toNumber()),
        endTime: moment.unix(stopTime.toNumber())
      }],
      rest: txns.slice(2)
    }

  } catch (e) {
    console.error("Error parsing Sablier Magnet");
    console.error(e);
    return null;
  }
}
