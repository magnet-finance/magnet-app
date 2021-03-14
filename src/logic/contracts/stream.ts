import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { StreamMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { convertToDecimals } from '../tokenType';
import SablierAbi from './abi/sablier.json';
import { getContractAddresses } from './contractAddresses';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const sablierAddress = getContractAddresses(provider.network.chainId).sablierContractAddress;
  return new Contract(sablierAddress, SablierAbi, provider);
});

export const getStreamTxn = async (magnet: StreamMagnetDefinition, provider: Web3Provider) : Promise<Transaction[]> => {
  const contract = getContract(provider);
  const amount = convertToDecimals(magnet.lifetimeValue, magnet.tokenType, provider.network.chainId);
  // TODO: call approve() first
  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("createStream", [
      magnet.recipient,       // sablier.recipient
      amount,   // sablier.deposit
      magnet.tokenType,       // sablier.tokenAddress
      magnet.startTime.unix(),// sablier.startTime
      magnet.endTime.unix()   // sablier.startTime
    ])
  }];
}
