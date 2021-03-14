import { VestMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';
import { getErc20ApproveTxn } from './erc20';

export const getVestTxn = (magnet: VestMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const start = magnet.startTime.unix();
  const end = magnet.endTime.unix();
  const duration = end - start;
  const durationToCliff = magnet.cliffTime.unix() - start;
  if (duration < 0 ||  duration < durationToCliff) {
    throw Error(`Transaction Error: Invalid Times for Vest Contract start:${start} end:${end} cliff:${magnet.cliffTime.unix()}`);
  }

  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  const contract = contractManager.getYVestFactoryContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [
    // Approve ERC20
    getErc20ApproveTxn(magnet.token, contract.address, amount, web3),
    // Create Vest Contract
    {
      to: contract.address,
      value: Transaction.DEFAULT_VALUE,
      data: contract.interface.encodeFunctionData("deploy_vesting_contract(address,address,uint256,uint256,uint256,uint256)", [
        magnet.token.address,   // yVestFactory.token
        magnet.recipient,       // yVestFactory.recipient
        amount,                 // yVestFactory.amount
        duration,               // yVestFactory.vesting_duration
        start,                  // yVestFactory.vesting_start
        durationToCliff         // yVestFactory.cliff_length
      ])
    }
  ];
}
