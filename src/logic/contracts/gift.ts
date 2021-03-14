import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import memoize from 'lodash/memoize';
import { GiftMagnetDefinition } from '../../types/magnet';
import { Transaction } from '../../types/Transaction';
import { convertToDecimals } from '../tokenType';
import yGiftAbi from './abi/yGift.json';
import { getContractAddresses } from './contractAddresses';

const getContract = memoize((provider: Web3Provider) : Contract => {
  const yGiftAddress = getContractAddresses(provider.network.chainId).yGiftContractAddress;
  return new Contract(yGiftAddress, yGiftAbi, provider);
});

export const getGiftTxn = async (magnet: GiftMagnetDefinition, provider: Web3Provider) : Promise<Transaction[]> => {
  const contract = getContract(provider);
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
