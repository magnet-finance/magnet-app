import memoize from "lodash/memoize";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { Web3ReactContext } from "../types/web3ReactContext";
import { getGnosisTxn } from "./transactionManager";
import { fetchJson } from "./util/fetch";

// Config Definitions

type GnosisConfig = {
  txServiceUrl: string,
  safeRelayUrl: string
};

const ChainIdToGnosisConfig : {[key: number]: GnosisConfig} = {
  1: {
    txServiceUrl: "https://safe-transaction.mainnet.gnosis.io",
    safeRelayUrl: "https://safe-relay.mainnet.gnosis.io"
  },
  4: {
    txServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
    safeRelayUrl: "https://safe-relay.rinkeby.gnosis.io"
  },
}

// Gnosis API Types

type SafeInfo = {
  address: string,
  nonce:	number,
  threshold: number,
  owners: string[],
  modules: string[],
  fallbackHandler: string,
  version: string
}

type Confirmation = {
  owner: string,
  submissionDate: string,
  transactionHash?: string,
  confirmationType: string,
  signature: string,
  signatureType: string
}

type SafeTxResponse = {
  safe: string,
  to: string,
  value: string,
  data?: string,
  operation: number,
  gasToken?: string,
  safeTxGas: number,
  baseGas: number,
  gasPrice: string,
  refundReceiver?: string,
  nonce: number,
  executionDate?: string,
  submissionDate: string,
  modified: string,
  blockNumber?: null,
  transactionHash?: null,
  safeTxHash: string,
  executor?: string,
  isExecuted: boolean,
  isSuccessful?: boolean,
  ethGasPrice?: string,
  gasUsed: number,
  fee?: number,
  origin: string,
  dataDecoded?: string,
  confirmationsRequired?: number,
  confirmations: Confirmation[],
  signatures?: string
}

type SafeTxnsResponse = {
  count: number,
  // Next URL for list (not temporal)
  next?: string,
  // Previous URL for list (not temporal)
  previous?: string,
  results: SafeTxResponse[],
  countUniqueNonce: number
}

type GasEstimateResponse = {
  safeTxGas: string,
  baseGas: string,
  dataGas: string,
  operationalGas: string,
  gasPrice: string,
  lastUsedNonce: number,
  gasToken: string,
  refundReceiver: string
}

// Internal Functions


const getSafeInfo = (config: GnosisConfig, safeAddress: string) : Promise<SafeInfo> => {
  return fetchJson<SafeInfo>(`${config.txServiceUrl}/api/v1/safes/${safeAddress}/`);
}

const getLastSubmittedTxn = async (config: GnosisConfig, safeAddress: string) : Promise<SafeTxResponse> => {
  const list = await fetchJson<SafeTxnsResponse>(`${config.txServiceUrl}/api/v1/safes/${safeAddress}/transactions/?limit=1`);
  const txn = list.results?.[0];
  if (txn == null) {
    throw Error("Gnosis Error: Unable to find any transactions")
  }
  return txn;
}

const getNextNonce = async (config: GnosisConfig, safeAddress: string, fallback?: number) : Promise<number> => {
  try {
    const highestPendingTx = await getLastSubmittedTxn(config, safeAddress);
    return highestPendingTx.nonce + 1;
  } catch (e) {
    // If a fallback was provided use it
    if (fallback != null) {
      return fallback;
    }

    // Otherwise look for a fallback
    const safeInfo = await getSafeInfo(config, safeAddress);
    return safeInfo.nonce + 1;
  }
}



const estimateGas = (config: GnosisConfig, safeAddress: string, txn: Transaction): Promise<GasEstimateResponse> => {
    return fetchJson<GasEstimateResponse>(`${config.safeRelayUrl}/v2/safes/${safeAddress}/transactions/estimate/`, "POST", {
        to: txn.to,
        value: txn.value,
        data: txn.data,
        operation: txn.operation,
        gasToken: null
    });
}


// Gnosis Manager

export type GnosisManager = {
  submitMagnets: (magnets: MagnetDefinition[], gnosisSafeAddress: string) => void
}

const _getGnosisManagerHelper = memoize((config: GnosisConfig, web3: Web3ReactContext) : GnosisManager => ({
  submitMagnets: async (magnets) => {
    const txn = getGnosisTxn(magnets, web3);
  }
}));

export const getGnosisManager = (web3: Web3ReactContext) : GnosisManager | undefined => {
  if (web3 == null) {
    return undefined;
  }
  const providerChainId = web3.chainId;
  if (providerChainId == null || ChainIdToGnosisConfig[providerChainId] == null) {
    return undefined;
  }
  return _getGnosisManagerHelper(ChainIdToGnosisConfig[providerChainId], web3);
}
