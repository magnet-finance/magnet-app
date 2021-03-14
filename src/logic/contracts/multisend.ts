import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { Transaction } from '../../types/Transaction';
import SablierAbi from './abi/sablier.json';
import { getContractAddresses } from './contractManager';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const sablierAddress = getContractAddresses(provider.network.chainId).sablierContractAddress;
  return new Contract(sablierAddress, SablierAbi, provider);
});

export const getStreamTxn = async (txns: Transaction[], provider: Web3Provider) : Promise<Transaction> => {
  const contract = getContract(provider);
  // TODO: call approve() first
  return {
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("createStream", [
      magnet.recipient,       // sablier.recipient
      magnet.lifetimeValue,   // sablier.deposit
      magnet.tokenType,       // sablier.tokenAddress
      magnet.startTime.unix(),// sablier.startTime
      magnet.endTime.unix()   // sablier.startTime
    ])
  };
}
