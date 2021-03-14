import { Content } from 'antd/lib/layout/layout';
import * as React from "react";
import { Wallet } from './Wallet';

export const WalletConnectPageComponent: React.FC = () => {
  return (
    <Content style={styles.content}>
      <Wallet />
      <div>Magnet only supports injected providers like Metamask for now :)</div>
    </Content>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
  }
}
