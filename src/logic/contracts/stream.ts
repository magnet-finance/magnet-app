import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { StreamMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import SablierAbi from './abi/sablier.json';
import { getContractAddresses } from './contractAddresses';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const sablierAddress = getContractAddresses(provider.network.chainId).sablierContractAddress;
  return new Contract(sablierAddress, SablierAbi, provider);
});

export const getStreamTxn = async (magnet: StreamMagnetDefinition, web3: Web3ReactContext) : Promise<Transaction[]> => {
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  const contract = getContract(web3.library);

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
