import { getAddress } from "@ethersproject/address";
import filter from "lodash/filter";
import find from "lodash/find";
import includes from "lodash/includes";
import map from "lodash/map";
import tokenList from "../logic/tokenList.json";
import { TokenInfo } from "../types/token";

const allTokens: TokenInfo[]  = tokenList.tokens;

const ChainIdToTokenList : {[key: number]: TokenInfo[]} = {
  1: filter(allTokens, token => token.chainId === 1),
  4: filter(allTokens, token => token.chainId === 4),
}

export const isTokenType = (tokenType: any, chainId?: number) : tokenType is string => {
  if (chainId == null) {
    return false;
  }
  const tokens = getAllTokens(chainId);
  return includes(map(tokens, "address"), tokenType);
}

export const getAllTokens = (chainId?: number): TokenInfo[] => {
  if (chainId == null) {
    chainId = 1; // default to mainnet tokens when user has not connected a wallet
  }
  return ChainIdToTokenList[chainId];
}

export const getToken = (tokenType: string, chainId?: number) : TokenInfo | undefined => {
  if (tokenType == null) {
    return undefined;
  }
  const tokens = getAllTokens(chainId);
  return find(tokens, (token) => getAddress(token.address) === getAddress(tokenType));
}

export const getTokenAddress = (tokenSymbol: string, chainId?: number) : string | undefined => {
  const tokens = getAllTokens(chainId);
  return find(tokens, (token) => token.symbol === tokenSymbol)?.address;
}
