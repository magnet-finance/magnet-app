import { Web3Provider } from '@ethersproject/providers';
import { GiftMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/transaction';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';

export const getGiftTxn = (magnet: GiftMagnetDefinition, provider?: Web3Provider) : Transaction[] => {
  const contractManager = getContractManager(provider);
  const tokenManager = getTokenManager(provider);
  if (provider == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid\nProvider: ${provider}`);
  }

  const contract = contractManager.getYGiftContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("mint", [
      magnet.recipient,       // yGift.recipient
      magnet.token.address,   // yGift.token
      amount,                 // yGift.amount
      magnet.giftName,        // yGift.name
      magnet.giftMessage,     // yGift.message
      magnet.giftImageUrl,    // yGift.url
      magnet.sendTime,        // yGift.start
      0,                      // yGift.duration
    ])
  }];
}
