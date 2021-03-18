import { isAddress } from '@ethersproject/address';
import { BigNumber, utils } from 'ethers';
import { Operation, Transaction, TxnParser } from '../../types/transaction';
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

const decodeMultiSendDataAsTxns = (data: string) : Transaction[] | null => {
  const txns: Transaction[] = [];
  let remainingData = data.replace(/^0x/, '');
  while (remainingData.length > 0) {
    try {
      const fullLengthOperation = "0".repeat(62) + remainingData.slice(0,2);
      const fullLengthTo = "0".repeat(24) + remainingData.slice(2,2+40);
      const fullLengthValue = remainingData.slice(2+40,2+40+64);
      const fullLengthDataLength = remainingData.slice(2+40+64, 2+40+64+64);

      // Data was trimmed for efficiency in encoding, it needs to be zero packed to get back to
      // full length
      const [operation, to, value, dataLength] = utils.defaultAbiCoder.decode(['uint8', 'address', 'uint256'],
        `0x${fullLengthOperation}${fullLengthTo}${fullLengthValue}${fullLengthDataLength}`
      );

      // Validate parse types
      if (
        operation !== Operation.CALL ||
        operation !== Operation.DELEGATE_CALL ||
        !isAddress(to) ||
        !BigNumber.isBigNumber(value) ||
        !BigNumber.isBigNumber(dataLength)
      ) {
        return null;
      }

      const data = `0x${remainingData.slice(2+40+64+64, 2+40+64+64+dataLength.toNumber())}`
      if (data.length !== dataLength.toNumber() + 2) {
        // parsed data is the wrong length (ran out of string)
        return null;
      }

      txns.push({
        operation,
        to,
        value,
        data
      });
      remainingData = remainingData.slice(2+40+64+64+dataLength.toNumber());
    } catch (e) {
      console.error("Error Decoding MultisendTxn");
      console.error(e);
      return null;
    }
  }
  return txns;
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

// Note this is a bit of a weird parser, it doesn't return any magnets
// it just unpacks the first txn and returns it at the beginning of rest
export const maybeParseMultiSendTxn : TxnParser = (txns, chainId) => {
  const txn = txns[0]; // we only need to look at the first one
  const contractManager = getContractManager(chainId);
  if (txn == null || contractManager == null || txn.to !== contractManager.contractAddresses.gnosisMultiSendContractAddress) {
    return null;
  }

  const parsed = decodeMultiSendDataAsTxns(txn.data);
  if (parsed == null) {
    return null;
  }

  return {
    magnets: [],
    rest: [...parsed, ...txns.slice(1)]
  };
}

