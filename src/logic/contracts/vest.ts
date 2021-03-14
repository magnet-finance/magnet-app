import { Web3Provider } from '@ethersproject/providers';
import { VestMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/transaction';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';

export const getVestTxn = (magnet: VestMagnetDefinition, provider: Web3Provider) : Transaction[] => {
  const start = magnet.startTime.unix();
  const end = magnet.endTime.unix();
  const duration = end - start;
  const durationToCliff = magnet.cliffTime.unix() - start;
  if (duration < 0 ||  duration < durationToCliff) {
    throw Error(`Transaction Error: Invalid Times for Vest Contract start:${start} end:${end} cliff:${magnet.cliffTime.unix()}`);
  }

  const contractManager = getContractManager(provider);
  const tokenManager = getTokenManager(provider);
  if (provider == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid\nProvider: ${provider}`);
  }

  const contract = contractManager.getYVestFactoryContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("deploy_vesting_contract", [
      magnet.token.address,   // yVestFactory.token
      magnet.recipient,       // yVestFactory.recipient
      amount,                 // yVestFactory.amount
      duration,               // yVestFactory.vesting_duration
      start,                  // yVestFactory.vesting_start
      durationToCliff         // yVestFactory.cliff_length
    ])
  }];
}
