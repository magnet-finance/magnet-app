import { Web3Provider } from '@ethersproject/providers';
import { utils } from 'ethers';
import { Transaction } from '../../types/transaction';
import { getContractManager } from './contractManager';

// Adapted from https://github.com/gnosis/safe-react/blob/94175a6970e4f5e149b83bbe994408d12e91fc5e/src/logic/safe/transactions/multisend.ts
const encodeTxnsAsMultiSendData = (txns: Transaction[]): string => {
  const joinedTxns = txns.map((tx) =>
      [
        utils.defaultAbiCoder.encode(['uint8'], [0]).slice(-2),
        utils.defaultAbiCoder.encode(['address'], [tx.to]).slice(-40),
        utils.defaultAbiCoder.encode(['uint256'], [tx.value]).slice(-64),
        utils.defaultAbiCoder.encode(['uint256'], [utils.arrayify(tx.data).length]).slice(-64),
        tx.data.replace(/^0x/, ''),
      ].join(''),
    ).join('')
  return `0x${joinedTxns}`
}


export const getMultiSendTxn = (txns: Transaction[], provider?: Web3Provider, forSendingToGnosis = false) : Transaction => {
  const contractManager = getContractManager(provider);
  if (provider == null || contractManager == null) {
    throw Error(`Transaction Error: Either not connected to a wallet or chain is invalid\nProvider: ${provider}`);
  }

  const contract = forSendingToGnosis ? contractManager.getGnosisMultiSendContract() : contractManager.getMultiSendContract();
  return {
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("multiSend", [
      encodeTxnsAsMultiSendData(txns)
    ])
  };
}
