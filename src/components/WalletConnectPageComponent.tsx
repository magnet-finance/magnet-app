import { Card } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import * as React from "react";
import { Wallet } from './Wallet';

export const WalletConnectPageComponent: React.FC = () => {
  return (
    <Content style={styles.content}>
      <Card style={styles.card}>
        <div style={styles.welcome}>Welcome</div>
        <Wallet />
        <div style={styles.supportedWallets}>
          Only injected providers like Metamask are supported for now :)
        </div>
      </Card>
    </Content>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  card: {
    marginTop: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 24,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    padding: 24,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 600,
    marginBottom: 48,
  },
  supportedWallets: {
    marginTop: 48,
    maxWidth: 250,
    fontSize: 14,
    fontWeight: 300,
    lineHeight: "22px",
    color: "#8C8C8C",
  }
}
