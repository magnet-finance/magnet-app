import { Content } from 'antd/lib/layout/layout';
import * as React from "react";
import { Wallet } from './Wallet';

export const WalletConnectPageComponent: React.FC = () => {
  return (
    <Content style={styles.content}>
      <Wallet />
    </Content>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    marginTop: 256,
    alignItems: "center",
  }
}
