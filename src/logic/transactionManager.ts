import flatMap from "lodash/flatMap";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { Web3ReactContext } from "../types/web3ReactContext";
import { getGiftTxn } from "./contracts/gift";
import { getMultiSendTxn } from "./contracts/multisend";
import { getStreamTxn } from "./contracts/stream";
import { getVestTxn } from "./contracts/vest";

export const executeTxn = async (txn: Transaction, web3:  Web3ReactContext) => {
  const provider = web3.library;
  if (provider == null) {
    throw Error("Transaction Execution Error: Provider is null");
  }
  const result = await provider.getSigner().sendTransaction({
    ...txn,
    gasLimit: 3000000
  });
  console.log(result);
  return result;
};

export const getMagnetsTxns = (magnets: MagnetDefinition[], web3: Web3ReactContext) : Transaction[] => {
  return flatMap(magnets, (m) => {
    if (m.type === "vest") {
      return getVestTxn(m, web3);
    } else if (m.type === "stream") {
      return getStreamTxn(m, web3);
    } else if (m.type === "gift") {
      return getGiftTxn(m, web3);
    } else {
      // Should never happen
      return [];
    }
  });
}

export const getGnosisTxn = (magnets: MagnetDefinition[], web3: Web3ReactContext) : Transaction | undefined => {
  const txns = getMagnetsTxns(magnets, web3);
  if (txns.length === 0) {
    return undefined;
  } else if (txns.length === 1) {
    return txns[0];
  } else {
    return getMultiSendTxn(txns, web3);
  }
}
