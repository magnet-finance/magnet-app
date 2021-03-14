import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { VestMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { getTokenManager } from '../tokenManager';
import yVestFactoryAbi from './abi/yVestFactory.json';
import { getContractAddresses } from './contractManager';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const vestAddress = getContractAddresses(provider.network.chainId).yVestFactoryContractAddress;
  return new Contract(vestAddress, yVestFactoryAbi, provider);
});

export const getVestTxn = async (magnet: VestMagnetDefinition, provider: Web3Provider) : Promise<Transaction[]> => {
  const contract = getContract(provider);
  const start = magnet.startTime.unix();
  const end = magnet.endTime.unix();
  const duration = end - start;
  const durationToCliff = magnet.cliffTime.unix() - start;
  if (duration < 0 ||  duration < durationToCliff) {
    throw Error(`Invalid Times for Vest Contract start:${start} end:${end} cliff:${magnet.cliffTime.unix()}`);
  }

  const tokenManager = getTokenManager(provider);
  if (provider == null || tokenManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("deploy_vesting_contract", [
      magnet.token,       // yVestFactory.token
      magnet.recipient,       // yVestFactory.recipient
      amount,                 // yVestFactory.amount
      duration,               // yVestFactory.vesting_duration
      start,                  // yVestFactory.vesting_start
      durationToCliff         // yVestFactory.cliff_length
    ])
  }];
}
