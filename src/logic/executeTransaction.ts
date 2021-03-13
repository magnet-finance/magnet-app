import { TransactionRequest, Web3Provider } from "@ethersproject/providers";

export const executeTransaction = async (txn: TransactionRequest, provider:  Web3Provider) => {
  const result = await provider.getSigner().sendTransaction(txn);
  console.log(result);
  return result;
;}
