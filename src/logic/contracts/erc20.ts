import { isAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { TokenInfo } from '../../types/token';
import { Operation, Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getTokenManager } from '../tokenManager';
import { getContractManager } from './contractManager';

export const getErc20ApproveTxn = (token: TokenInfo, spenderAddress: string, decimalAmount: BigNumber, web3: Web3ReactContext) : Transaction => {
  const contractManager = getContractManager(web3);
  if (web3 == null || web3.library == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  if (token.chainId !== web3.chainId) {
    throw Error(`Transaction Error: Trying to create Approve for token on wrong chain. Web3ChainID:${web3.chainId} TokenChainId:${token.chainId}`);
  }

  const contract = contractManager.getErc20Contract(token);
  return {
    operation: Operation.CALL,
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("approve", [
      spenderAddress, //erc20._spender (address)
      decimalAmount   //erc20._value (uint256)
    ])
  };
}

export const maybeParseErc20ApprovalTxn = (txn: Transaction, chainId: number) => {
  const contractManager = getContractManager(chainId);
  const tokenManager = getTokenManager(chainId);
  if (contractManager == null || tokenManager == null) {
    return null;
  }

  const token = tokenManager.getTokenInfo(txn.to);
  if (token == null) {
    return null;
  }

  const contract = contractManager.getErc20Contract(token);
  if (contract == null) {
    return null;
  }

  try {
    const [
      spenderAddress,
      decimalAmount
    ] = contract.interface.decodeFunctionData("approve", txn.data);

    // Validate data
    if (
      !isAddress(spenderAddress) ||
      !BigNumber.isBigNumber(decimalAmount)
    ) {
      return null;
    }

    return {
      token,
      spenderAddress,
      decimalAmount
    };
  } catch (e) {
    console.error(`Error parsing Erc20Approve: ${txn.to}`);
    console.error(e);
    return null;
  }
}
