import { utils } from 'ethers';
import { Operation, Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getContractManager } from './contractManager';

// Adapted from https://github.com/gnosis/safe-react/blob/94175a6970e4f5e149b83bbe994408d12e91fc5e/src/logic/safe/transactions/multisend.ts
const encodeTxnsAsMultiSendData = (txns: Transaction[]): string => {
  const joinedTxns = txns.map((tx) =>
      [
        utils.defaultAbiCoder.encode(['uint8'], [tx.operation]).slice(-2),
        utils.defaultAbiCoder.encode(['address'], [tx.to]).slice(-40),
        utils.defaultAbiCoder.encode(['uint256'], [tx.value]).slice(-64),
        utils.defaultAbiCoder.encode(['uint256'], [utils.arrayify(tx.data).length]).slice(-64),
        tx.data.replace(/^0x/, ''),
      ].join(''),
    ).join('')
  return `0x${joinedTxns}`
}


export const getMultiSendTxn = (txns: Transaction[], web3: Web3ReactContext) : Transaction => {
  const contractManager = getContractManager(web3);
  if (web3 == null || web3.library == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  const contract = contractManager.getGnosisMultiSendContract();
  return {
    operation: Operation.DELEGATE_CALL,
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("multiSend", [
      encodeTxnsAsMultiSendData(txns)
    ])
  };
}
