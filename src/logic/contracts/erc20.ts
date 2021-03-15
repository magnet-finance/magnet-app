import { BigNumber } from '@ethersproject/bignumber';
import { TokenInfo } from '../../types/token';
import { Operation, Transaction } from '../../types/transaction';
import { Web3ReactContext } from '../../types/web3ReactContext';
import { getContractManager } from './contractManager';

export const getErc20ApproveTxn = (token: TokenInfo, spenderAddress: string, decimalAmount: BigNumber, web3: Web3ReactContext) : Transaction => {
  const contractManager = getContractManager(web3);
  if (web3 == null || web3.library == null || contractManager == null) {
    throw Error(`Transaction Error: wallet not connected or chain ID incompatible`);
  }

  if (token.chainId !== web3.chainId) {
    throw Error(`Transaction Error: Trying to create Approve for token on wrong chain. Web3ChainID:${web3.chainId} TokenChainId:${token.chainId}`);
  }

  const contract = contractManager.getTokenContract(token);
  return {
    operation: Operation.CALL,
    to: contract.address,
    value: Transaction.DEFAULT_VALUE,
    data: contract.interface.encodeFunctionData("approve", [
      spenderAddress, //erc20._spender
      decimalAmount   //erc20._value
    ])
  };
}
