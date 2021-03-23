import Avatar from "antd/lib/avatar/avatar";
import * as React from "react";
import { TokenInfo } from '../types/token';

type Props = {
  token: TokenInfo | undefined;
}

export const TokenLabel: React.FC<Props> = (props) => {
  const token = props.token;
  const iconURI = token?.logoURI ?? "";
  const symbol = token?.symbol ?? "";

  return (
    <span style={styles.container}>
      <Avatar style={styles.avatar} src={iconURI} />
      <span style={styles.symbol}>{symbol}</span>
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
