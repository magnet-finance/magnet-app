import { getAddress } from "@ethersproject/address";
import { BigNumber } from "@ethersproject/bignumber";
import { memoize } from "lodash";
import filter from "lodash/filter";
import find from "lodash/find";
import includes from "lodash/includes";
import map from "lodash/map";
import tokenList from "../logic/tokenList.json";
import { TokenInfo } from "../types/token";
import { Web3ReactContext } from "../types/web3ReactContext";

const ChainIdToTokenList : {[key: number]: TokenInfo[]} = {
  1: filter(tokenList.tokens, token => token.chainId === 1),
  4: filter(tokenList.tokens, token => token.chainId === 4),
}

export type TokenManager = {
  chainId: number,
  tokens: TokenInfo[],
  isTokenAddress: (tokenAddress: any) => tokenAddress is string,
  getTokenInfo: (tokenAddress: string) => TokenInfo | undefined,
  getTokenInfoBySymbol: (tokenSymbol: string) => TokenInfo | undefined,
  convertToDecimals: (amount: BigNumber, tokenInfo: TokenInfo) => BigNumber
};

const _getTokenManagerHelper = memoize((chainId) : TokenManager => {
  return {
    chainId,
    tokens: ChainIdToTokenList[chainId],
    isTokenAddress: memoize((tokenAddress) : tokenAddress is string => includes(map(ChainIdToTokenList[chainId], "address"), tokenAddress)),
    getTokenInfo: memoize((tokenAddress) => find(ChainIdToTokenList[chainId], (token) => getAddress(token.address) === getAddress(tokenAddress))),
    getTokenInfoBySymbol: memoize((tokenSymbol) => find(ChainIdToTokenList[chainId], (token) => token.symbol === tokenSymbol)),
    convertToDecimals: (amount, tokenInfo) => amount.mul(BigNumber.from(10).pow(tokenInfo.decimals)),
  }
});

export const getTokenManager = (web3?: Web3ReactContext) : TokenManager | undefined => {
  if (web3 == null) {
    return undefined;
  }
  const providerChainId = web3.chainId;
  if (providerChainId == null || ChainIdToTokenList[providerChainId] == null) {
    return undefined;
  }
  return _getTokenManagerHelper(providerChainId);
};
