import Avatar from "antd/lib/avatar/avatar";
import * as React from "react";

type Props = {
  address: string;
}

export const Address: React.FC<Props> = (props) => {
  return (
    <span style={styles.container}>
      <Avatar style={styles.avatar} />
      <span style={styles.address}>{props.address}</span>
    </span>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  container: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
  },
  address: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: "28px",
    marginLeft: 16,
  },
}
