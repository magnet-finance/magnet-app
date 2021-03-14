import { Web3Provider } from "@ethersproject/providers";
import flatMap from "lodash/flatMap";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { getGiftTxn } from "./contracts/gift";
import { getMultiSendTxn } from "./contracts/multisend";
import { getStreamTxn } from "./contracts/stream";
import { getVestTxn } from "./contracts/vest";

export const executeTxn = async (txn: Transaction, provider:  Web3Provider) => {
  const result = await provider.getSigner().sendTransaction(txn);
  console.log(result);
  return result;
};

export const getMagnetsTxn = (magnets: MagnetDefinition[], provider: Web3Provider, forSendingToGnosis=false) : Transaction | undefined => {
  const allTxns = flatMap(magnets, (m) => {
    if (m.type === "vest") {
      return getVestTxn(m, provider);
    } else if (m.type === "stream") {
      return getStreamTxn(m, provider);
    } else if (m.type === "gift") {
      return getGiftTxn(m, provider);
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
    return getMultiSendTxn(allTxns, provider, forSendingToGnosis);
  }
}
