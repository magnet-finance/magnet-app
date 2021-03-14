import { Web3Provider } from '@ethersproject/providers';
import { StreamMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/transaction';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';

export const getStreamTxn = (magnet: StreamMagnetDefinition, provider: Web3Provider) : Transaction[] => {
  const contractManager = getContractManager(provider);
  const tokenManager = getTokenManager(provider);
  if (provider == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid\nProvider: ${provider}`);
  }

  const contract = contractManager.getSablierContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  // TODO: call approve() first

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("createStream", [
      magnet.recipient,       // sablier.recipient
      amount,                 // sablier.deposit
      magnet.token.address,   // sablier.tokenAddress
      magnet.startTime.unix(),// sablier.startTime
      magnet.endTime.unix()   // sablier.startTime
    ])
  }];
}
