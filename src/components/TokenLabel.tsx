import Avatar from "antd/lib/avatar/avatar";
import * as React from "react";
import { getToken } from "../logic/tokenType";

type Props = {
  address: string;
  chainId?: number;
}

export const TokenLabel: React.FC<Props> = (props) => {
  const token = getToken(props.address, props.chainId);
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
