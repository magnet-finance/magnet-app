import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { VestMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import yVestFactoryAbi from './abi/yVestFactory.json';
import { getContractAddresses } from './contractAddresses';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const vestAddress = getContractAddresses(provider.network.chainId).yVestFactoryContractAddress;
  return new Contract(vestAddress, yVestFactoryAbi, provider);
});

export const getVestTxn = async (magnet: VestMagnetDefinition, web3: Web3ReactContext) : Promise<Transaction[]> => {
  const start = magnet.startTime.unix();
  const end = magnet.endTime.unix();
  const duration = end - start;
  const durationToCliff = magnet.cliffTime.unix() - start;
  if (duration < 0 ||  duration < durationToCliff) {
    throw Error(`Invalid Times for Vest Contract start:${start} end:${end} cliff:${magnet.cliffTime.unix()}`);
  }

  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  const contract = getContract(web3.library);

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
