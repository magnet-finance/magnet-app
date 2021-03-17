import EIP712Domain from "eth-typed-data";
import { BigNumber, utils } from 'ethers';
import memoize from "lodash/memoize";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { Web3ReactContext } from "../types/web3ReactContext";
import { getGnosisTxn } from "./transactionManager";
import { fetchJson, JSON_HEADERS } from "./util/fetch";

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
type GnosisSubmitTxnRequest = {
  to: string,
  value: number,
  data?: string,
  operation: number,
  gasToken?: string,
  safeTxGas: number,
  baseGas: number,
  gasPrice: number,
  refundReceiver?: string,
  nonce: number,
  contractTransactionHash: string,
  sender: string,
  signature: string,
  origin: string
};

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

const getGasEstimate = (config: GnosisConfig, safeAddress: string, txn: Transaction): Promise<GasEstimateResponse> => {
  console.log("estimating gas for tx:",txn);
  return fetchJson<GasEstimateResponse>(`${config.safeRelayUrl}/api/v2/safes/${safeAddress}/transactions/estimate/`, "POST", {
    to: txn.to,
    value: txn.value.toNumber(),
    data: txn.data,
    operation: txn.operation,
    gasToken: null
  });
}

const signAndGetSubmitReq = async (safeAddress: string, txn: Transaction, nonce: number, gasEstimate: GasEstimateResponse, web3: Web3ReactContext) : Promise<GnosisSubmitTxnRequest> => {
  // From https://gist.github.com/rmeissner/0fa5719dc6b306ba84ee34bebddc860b#file-safe_sig_gen_uport_eip712-ts-L114
  const safeDomain = new EIP712Domain({
    verifyingContract: safeAddress
  });

  const SafeTx = safeDomain.createType('SafeTx', [
    { type: "address", name: "to" },
    { type: "uint256", name: "value" },
    { type: "bytes", name: "data" },
    { type: "uint8", name: "operation" },
    { type: "uint256", name: "safeTxGas" },
    { type: "uint256", name: "baseGas" },
    { type: "uint256", name: "gasPrice" },
    { type: "address", name: "gasToken" },
    { type: "address", name: "refundReceiver" },
    { type: "uint256", name: "nonce" },
  ]);

  const gnosisTxnSubmitReq : Omit<GnosisSubmitTxnRequest, "contractTransactionHash" | "sender" | "signature" | "origin"> = {
    ...txn,
    // This just validates and coerces the to address, it should already be done, but doing it again can't hurt.
    to: utils.getAddress(txn.to),
    value: txn.value.toNumber(),
    nonce,
    safeTxGas: BigNumber.from(gasEstimate.safeTxGas).toNumber(),
    // We don't want to use the refund logic of the safe so lets use the default values
    baseGas: 0,
    gasPrice: 0,
    gasToken: "0x0000000000000000000000000000000000000000",
    refundReceiver: "0x0000000000000000000000000000000000000000",
  }

  const safeTxn = new SafeTx({
    ...gnosisTxnSubmitReq,
    // We need to convert data to an array
    data: utils.arrayify(txn.data),
  });

  // Note: signHash() is a function on the eth-typed-data library. It does not support typescript.
  const contractTransactionHash = "0x" + safeTxn.signHash().toString('hex');

  const provider = web3.library;
  if (provider == null) {
    throw Error("Gnosis Error: Unable to get current provider");
  }
  const myAddress = await provider.getSigner().getAddress();
  // Note:  JSON.stringify turns data into the wrong type if it is a byte array
  // So we need to manually replace data with the data string in the request
  const generatedSigReq = safeTxn.toSignatureRequest()
  const sigReq = {
    ...generatedSigReq,
    message: {
      ...generatedSigReq.message,
      data: gnosisTxnSubmitReq.data
    }
  }
  console.log(safeTxn.toSignatureRequest());
  // Using this instead of signer._signTypedData because it is an experimental api
  const signature = await provider.send("eth_signTypedData_v4", [
    myAddress,
    JSON.stringify(sigReq)
  ]);

  return {
    ...gnosisTxnSubmitReq,
    contractTransactionHash,
    sender: myAddress,
    signature,
    origin: "Magnet"
  }
}

const submitTxnToGnosis = async (config: GnosisConfig, safeAddress: string, submitReq: GnosisSubmitTxnRequest) : Promise<boolean> => {
  const result = await fetch(`${config.txServiceUrl}/api/v1/safes/${safeAddress}/transactions/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(submitReq)
  });
  // Successful status codes are in the 200s
  return result.status < 300;
}

// Gnosis Manager

export type GnosisManager = {
  submitMagnets: (magnets: MagnetDefinition[], gnosisSafeAddress: string) => void
}

const _getGnosisManagerHelper = memoize((config: GnosisConfig, web3: Web3ReactContext) : GnosisManager => ({
  submitMagnets: async (magnets, safeAddress) => {
    const txn = getGnosisTxn(magnets, web3);
    if (txn == null) {
      throw Error("Gnosis Error: Unable to submit null transaction");
    }
    const gasEstimate = await getGasEstimate(config, safeAddress, txn);
    console.log(gasEstimate);
    const nonce = await getNextNonce(config, safeAddress, gasEstimate.lastUsedNonce + 1);
    console.log(`Nonce: ${nonce}`);
    const submitReq = await signAndGetSubmitReq(
      safeAddress,
      txn,
      nonce,
      gasEstimate,
      web3
    );
    console.log(submitReq);
    return await submitTxnToGnosis(config, safeAddress, submitReq);
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
