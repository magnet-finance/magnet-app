import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { GiftMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import yGiftAbi from './abi/yGift.json';
import { getContractAddresses } from './contractAddresses';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const yGiftAddress = getContractAddresses(provider.network.chainId).yGiftContractAddress;
  return new Contract(yGiftAddress, yGiftAbi, provider);
});

export const getGiftTxn = async (magnet: GiftMagnetDefinition, web3: Web3ReactContext) : Promise<Transaction[]> => {
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }
  const amount = tokenManager.convertToDecimals(magnet.lifetimeValue, magnet.token);

  const contract = getContract(web3.library);

  return [{
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("mint", [
      magnet.recipient,       // yGift.recipient
      magnet.token,           // yGift.token
      amount,                 // yGift.amount
      magnet.giftName,        // yGift.name
      magnet.giftMessage,     // yGift.message
      magnet.giftImageUrl,    // yGift.url
      magnet.sendTime,        // yGift.start
      0,                      // yGift.duration
    ])
  }];
}
