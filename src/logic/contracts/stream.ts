import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { StreamMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { getTokenManager } from '../tokenManager';
import SablierAbi from './abi/sablier.json';
import { getContractAddresses } from './contractManager';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const sablierAddress = getContractAddresses(provider.network.chainId).sablierContractAddress;
  return new Contract(sablierAddress, SablierAbi, provider);
});

export const getStreamTxn = async (magnet: StreamMagnetDefinition, provider: Web3Provider) : Promise<Transaction[]> => {
  const contract = getContract(provider);
  const tokenManager = getTokenManager(provider);
  if (provider == null || tokenManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  // TODO: call approve() first

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("createStream", [
      magnet.recipient,       // sablier.recipient
      amount,                 // sablier.deposit
      magnet.token,           // sablier.tokenAddress
      magnet.startTime.unix(),// sablier.startTime
      magnet.endTime.unix()   // sablier.startTime
    ])
  }];
}
