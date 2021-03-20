import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import isString from 'lodash/isString';
import moment from 'moment';
import { GiftMagnetDefinition } from '../../types/magnet';
import { Operation, Transaction, TxnParser } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';
import { getErc20ApproveTxn, maybeParseErc20ApprovalTxn } from './erc20';

export const getGiftTxn = (magnet: GiftMagnetDefinition, web3: Web3ReactContext) : Transaction[] => {
  const contractManager = getContractManager(web3);
  const tokenManager = getTokenManager(web3);
  if (web3 == null || web3.library == null || tokenManager == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid`);
  }

  const contract = contractManager.getYGiftContract();
  const sendTime = magnet.sendTime.unix();

  return [
    // Approve ERC20
    getErc20ApproveTxn(magnet.token, contract.address, magnet.lifetimeValue, web3),
    {
      operation: Operation.CALL,
      to: contract.address,
      value: Transaction.DEFAULT_VALUE,
      data: contract.interface.encodeFunctionData("mint", [
        magnet.recipient,       // yGift.recipient
        magnet.token.address,   // yGift.token
        magnet.lifetimeValue,                 // yGift.amount
        magnet.giftName,        // yGift.name
        magnet.giftMessage,     // yGift.message
        magnet.giftImageUrl,    // yGift.url
        sendTime,               // yGift.start
        0,                      // yGift.duration
      ])
    }];
}


export const maybeParseGiftTxn : TxnParser<GiftMagnetDefinition> = (txns, chainId) => {
  const contractManager = getContractManager(chainId);
  if (
    txns == null ||
    txns.length < 2 ||
    contractManager == null ||
    txns[1].to !== contractManager.contractAddresses.yGiftContractAddress
  ) {
    return null;
  }
  const approveTxn = txns[0];
  const mintTxn = txns[1];

  try {
    const [
      recipient,       // yGift.recipient (address)
      tokenAddress,    // yGift.token (address)
      lifetimeValue,   // yGift.amount (uint256)
      giftName,        // yGift.name (string)
      giftMessage,     // yGift.message (string)
      giftImageUrl,    // yGift.url (string)
      sendTime,        // yGift.start (uint256)
      duration,        // yGift.duration (uint256)
    ] = contractManager.getYGiftContract().interface.decodeFunctionData("mint", mintTxn.data);

    //Validate parse
    if (
      !isAddress(recipient) ||
      !isAddress(tokenAddress) ||
      !BigNumber.isBigNumber(lifetimeValue) ||
      !isString(giftName) ||
      !isString(giftMessage) ||
      !isString(giftImageUrl) ||
      !BigNumber.isBigNumber(sendTime) ||
      !BigNumber.isBigNumber(duration) ||
      !duration.eq(0)
    ) {
      return null;
    }

    const parsedToken = maybeParseErc20ApprovalTxn(approveTxn, chainId);
    if (
      parsedToken == null ||
      parsedToken.token.address != tokenAddress ||
      !parsedToken.decimalAmount.eq(lifetimeValue) ||
      // Note: this final check may break if strings aren't formatted the same
      parsedToken.spenderAddress !== contractManager.contractAddresses.yGiftContractAddress
    ) {
      return null;
    }

    return {
      magnets: [{
        type: "gift",
        recipient,
        lifetimeValue,
        token: parsedToken.token,
        giftName,
        giftMessage,
        giftImageUrl,
        sendTime: moment.unix(sendTime.toNumber())
      }],
      rest: txns.slice(2)
    }

  } catch (e) {
    console.error("Error parsing yGift Magnet");
    console.error(e);
    return null;
  }
}
