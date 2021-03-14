import { Web3Provider } from '@ethersproject/providers';
import { GiftMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { convertToDecimals } from '../tokenType';
import { getContractManager } from './contractManager';

export const getGiftTxn = async (magnet: GiftMagnetDefinition, provider?: Web3Provider) : Promise<Transaction[]> => {
  const contractManager = getContractManager(provider);
  if (contractManager == null) {
    throw Error(`Either not connected to a wallet or chain is invalid\nProvider: ${provider}`);
  }
  const contract = contractManager.getYGiftContract();
  const amount = convertToDecimals(magnet.lifetimeValue, magnet.tokenType, provider.network.chainId);
  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("mint", [
      magnet.recipient,       // yGift.recipient
      magnet.tokenType,       // yGift.token
      amount,                 // yGift.amount
      magnet.giftName,        // yGift.name
      magnet.giftMessage,     // yGift.message
      magnet.giftImageUrl,    // yGift.url
      magnet.sendTime,        // yGift.start
      0,                      // yGift.duration
    ])
  }];
}
