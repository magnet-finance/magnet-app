import { TransactionRequest } from "@ethersproject/providers";
import { Web3ReactContext } from "../types/web3ReactContext";

export const executeTransaction = async (txn: TransactionRequest, web3: Web3ReactContext) => {
  const result = await web3.library?.getSigner().sendTransaction(txn);
  console.log(result);
  return result;
;}
