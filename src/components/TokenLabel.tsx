import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import Avatar from "antd/lib/avatar/avatar";
import * as React from "react";
import { getTokenManager } from "../logic/tokenManager";

type Props = {
  address: string;
}

export const TokenLabel: React.FC<Props> = (props) => {
  const web3 = useWeb3React<Web3Provider>();
  const tokenManager = getTokenManager(web3);
  if (web3 == null || tokenManager == null) {
    console.error("TokenLabel Error: No Wallet connected");
    return null;
  }
  const token = tokenManager.getTokenInfo(props.address);

  return (
    <span style={styles.container}>
      <Avatar style={styles.avatar} src={token?.logoURI} />
      <span style={styles.symbol}>{token?.symbol}</span>
    </span>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  container: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 22,
    height: 22,
  },
  symbol: {
    fontSize: 14,
    lineHeight: "22px",
    marginLeft: 8,
  },
}
