import Avatar from "antd/lib/avatar/avatar";
import * as React from "react";
import { getTokenDisplayString } from "../logic/tokenType";

type Props = {
  address: string;
}

export const TokenLabel: React.FC<Props> = (props) => {
  return (
    <span style={styles.container}>
      <Avatar style={styles.avatar} />
      <span style={styles.ticker}>{getTokenDisplayString(props.address)}</span>
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
  ticker: {
    fontSize: 14,
    lineHeight: "22px",
    marginLeft: 8,
  },
}
