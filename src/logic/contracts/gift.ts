import { GiftMagnetDefinition } from '../../types/magnet';
import { Operation, Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';

export const getGiftTxn = (magnet: GiftMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid`);
  }

  const contract = contractManager.getYGiftContract();
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  return [{
    operation: Operation.CALL,
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
