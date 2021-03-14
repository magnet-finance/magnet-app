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
  const result = await provider.getSigner().sendTransaction(txn);
  console.log(result);
  return result;
};

export const getMagnetsTxn = (magnets: MagnetDefinition[], web3: Web3ReactContext, forSendingToGnosis=false) : Transaction | undefined => {
  const allTxns = flatMap(magnets, (m) => {
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

  if (allTxns.length === 0) {
    // We didn't get any?
    return undefined;
  } else if (allTxns.length === 1) {
    // No need to wrap in multisend if there's only one
    return allTxns[0];
  } else {
    return getMultiSendTxn(allTxns, web3, forSendingToGnosis);
  }
}
