import EIP712Domain from "eth-typed-data";
import { BigNumber, utils } from 'ethers';
import memoize from "lodash/memoize";
import { MagnetDefinition } from "../types/magnet";
import { Transaction } from "../types/transaction";
import { Web3ReactContext } from "../types/web3ReactContext";
import { getGnosisTxn, parseTxnsIntoMagnets } from "./transactionManager";
import { fetchJson, JSON_HEADERS } from "./util/fetch";

// Config Definitions

type GnosisConfig = {
  txServiceUrl: string,
  safeRelayUrl: string,
  safeAppUrl: string,
};

const ChainIdToGnosisConfig : {[key: number]: GnosisConfig} = {
  1: {
    txServiceUrl: "https://safe-transaction.mainnet.gnosis.io",
    safeRelayUrl: "https://safe-relay.mainnet.gnosis.io",
    safeAppUrl: "https://gnosis-safe.io/app/#/safes/",
  },
  4: {
    txServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
    safeRelayUrl: "https://safe-relay.rinkeby.gnosis.io",
    safeAppUrl: "https://rinkeby.gnosis-safe.io/app/#/safes/",
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
  return fetchJson<GasEstimateResponse>(`${config.safeRelayUrl}/api/v2/safes/${safeAddress}/transactions/estimate/`, "POST", {
    to: txn.to,
    value: txn.value.toNumber(),
    data: txn.data,
    operation: txn.operation,
    gasToken: null
  });
}

type UnsignedGnosisTxn = Omit<GnosisSubmitTxnRequest, "contractTransactionHash" | "sender" | "signature" | "origin">;

const getUnsignedGnosisTxn = (txn: Transaction, nonce: number, gasEstimate: GasEstimateResponse) => {
  return {
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
}

const signGnosisTxn = async (safeAddress: string, unsigned: UnsignedGnosisTxn, web3: Web3ReactContext) => {
  if (unsigned.data == null) {
    throw Error("Signing Error: Invalid unsigned txn\n\n" + JSON.stringify(unsigned))
  }

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

  const safeTxn = new SafeTx({
    ...unsigned,
    // We need to convert data to an array
    data: utils.arrayify(unsigned.data),
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
      data: unsigned.data
    }
  }
  // Using this instead of signer._signTypedData because it is an experimental api
  const signature : string = await provider.send("eth_signTypedData_v4", [
    myAddress,
    JSON.stringify(sigReq)
  ]);

  return {
    contractTransactionHash,
    signature,
    myAddress
  };
}

const signAndGetSubmitReq = async (safeAddress: string, txn: Transaction, nonce: number, gasEstimate: GasEstimateResponse, web3: Web3ReactContext) : Promise<GnosisSubmitTxnRequest> => {

  const unsigned = getUnsignedGnosisTxn(txn, nonce, gasEstimate);

  const {
    contractTransactionHash,
    myAddress,
    signature
  } = await signGnosisTxn(safeAddress, unsigned, web3);

  return {
    ...unsigned,
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

const getApprovalSignature = (gnosisResponse: SafeTxResponse, web3: Web3ReactContext) => {
  return signGnosisTxn(gnosisResponse.safe,
    {
      operation: gnosisResponse.operation,
      to: gnosisResponse.to,
      value: BigNumber.from(gnosisResponse.value).toNumber(),
      data: gnosisResponse.data,
      nonce: gnosisResponse.nonce,
      baseGas: gnosisResponse.baseGas,
      gasPrice: BigNumber.from(gnosisResponse.gasPrice).toNumber(),
      gasToken: gnosisResponse.gasToken,
      refundReceiver: gnosisResponse.refundReceiver,
      safeTxGas: gnosisResponse.safeTxGas
    },
    web3);
}

const submitApprovalToGnosis = async (config: GnosisConfig, gnosisResponse: SafeTxResponse, signature: string) : Promise<boolean> => {
  const result = await fetch(`${config.txServiceUrl}/api/v1/multisig-transactions/${gnosisResponse.safeTxHash}/confirmations/`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      signature
    })
  });
  return result.status < 300;
}

// Gnosis Manager

export type GnosisManager = {
  submitMagnets: (magnets: MagnetDefinition[], gnosisSafeAddress: string) => Promise<string>,
  submitApproval: (gnosisResponse: SafeTxResponse) => Promise<boolean>
}

const _getGnosisManagerHelper = memoize((config: GnosisConfig, web3: Web3ReactContext) : GnosisManager => ({
  submitMagnets: async (magnets, safeAddress) => {
    const txn = getGnosisTxn(magnets, web3);
    if (txn == null) {
      throw Error("Gnosis Error: Unable to submit null transaction");
    }
    const gasEstimate = await getGasEstimate(config, safeAddress, txn);
    const nonce = await getNextNonce(config, safeAddress, gasEstimate.lastUsedNonce + 1);
    const submitReq = await signAndGetSubmitReq(
      safeAddress,
      txn,
      nonce,
      gasEstimate,
      web3
    );
    await submitTxnToGnosis(config, safeAddress, submitReq);
    return submitReq.contractTransactionHash;
  },
  submitApproval: async (gnosisResponse: SafeTxResponse) => {
    const { signature } = await getApprovalSignature(gnosisResponse, web3)
    return await submitApprovalToGnosis(config, gnosisResponse, signature)
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

// Looking up info for the review screen
const fetchGnosisTxn = (chainId: number, safeTxHash: string) : Promise<SafeTxResponse> => {
  // Note: Should add type verification here, but not right now
  return fetchJson<SafeTxResponse>(`${ChainIdToGnosisConfig[chainId].txServiceUrl}​/api/v1/transactions/${safeTxHash}/`)
}

export type GnosisLookupError = {
  successful: false,
  error: "NOT_FOUND" | "PARSE_ERROR"
}

export type GnosisLookupResult = {
  successful: true,
  chainId: number,
  magnets: MagnetDefinition[],
  gnosisResponse: SafeTxResponse
}

export const lookupGnosisTxn = async (safeTxHash: string) : Promise<GnosisLookupResult | GnosisLookupError> => {
  for (const chainIdStr in ChainIdToGnosisConfig) {
    const chainId = Number(chainIdStr);
    try {
      const gnosisResponse = await fetchGnosisTxn(chainId, safeTxHash);
      const txn : Transaction = {
        to: gnosisResponse.to,
        data: gnosisResponse.data ?? Transaction.DEFAULT_DATA,
        operation: gnosisResponse.operation,
        value: BigNumber.from(gnosisResponse.value)
      }

      const parsed = parseTxnsIntoMagnets([txn], chainId);
      if (parsed == null) {
        return {
          successful: false,
          error: "PARSE_ERROR"
        };
      }
      return {
        successful: true,
        chainId,
        magnets: parsed,
        gnosisResponse
      };
    } catch (e) {
      // Not necessarily an error, maybe just the wrong chain
      console.log(e)
    }
  }
  return {
    successful: false,
    error: "NOT_FOUND"
  }
}

export const getSafeAppTransactionsPageUrl = (safeAddress: string, chainId: number) : string => {
  return `${ChainIdToGnosisConfig[chainId].safeAppUrl}${safeAddress}/transactions`;
}
