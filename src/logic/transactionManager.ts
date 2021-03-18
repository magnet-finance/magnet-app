import flatMap from "lodash/flatMap";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { Web3ReactContext } from "../types/web3ReactContext";
import { getGiftTxn, maybeParseGiftTxn } from "./contracts/gift";
import { getMultiSendTxn, maybeParseMultiSendTxn } from "./contracts/multisend";
import { getStreamTxn, maybeParseStreamTxn } from "./contracts/stream";
import { getVestTxn, maybeParseVestTxn } from "./contracts/vest";

export const executeTxn = async (txn: Transaction, web3:  Web3ReactContext) => {
  const provider = web3.library;
  if (provider == null) {
    throw Error("Transaction Execution Error: Provider is null");
  }
  const result = await provider.getSigner().sendTransaction({
    ...txn,
    gasLimit: 3000000
  });
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

// Transaction Parsing Logic

export const parseTxnsIntoMagnets = (txns: Transaction[], chainId: number) : MagnetDefinition[] | null => {
  let magnets : MagnetDefinition[] = []
  let remainingTxns = [...txns]; // Shallow clone the array
  while (remainingTxns.length > 0) {
    // At most one of these would return a non-null value
    // This will try them in order
    const result =
      maybeParseMultiSendTxn(remainingTxns, chainId) ??
      maybeParseGiftTxn(remainingTxns, chainId) ??
      maybeParseStreamTxn(remainingTxns, chainId) ??
      maybeParseVestTxn(remainingTxns, chainId);
    if (result == null) {
      return null;
    }
    magnets = [...magnets, ...result.magnets];
    remainingTxns = result.rest;
  }
  return magnets;
}
