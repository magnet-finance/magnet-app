import { Web3Provider } from '@ethersproject/providers';
import { Theme, SwapWidget } from '@uniswap/widgets/dist/index.js';
import { useWeb3React } from "@web3-react/core";
import Layout, { Content } from "antd/lib/layout/layout";
import * as React from "react";
import { Helmet } from 'react-helmet';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { WalletConnectPageComponent } from "../components/WalletConnectPageComponent";

// markup
const SwapPage = () => {

  const web3 = useWeb3React<Web3Provider>();

  return (
    <Layout style={styles.layout}>
      <Helmet>
        <title>Magnet</title>
      </Helmet>
      <Header />
      <Content style={styles.content}>
        {web3.chainId ? (
          <div className="Uniswap">
            <SwapWidget
              provider={web3.library}
              jsonRpcEndpoint="https://mainnet.infura.io/v3/82cc3a3c6f3347faac6daac1e7027b88"
              theme={theme} />
          </div>
        ) : (
          <WalletConnectPageComponent />
        )}
      </Content>
      <Footer />
    </Layout>
  );
}

const theme: Theme = {
  fontFamily: '"Poppins"',
  container: "#F5F5F5",
  accent: "#1890FF",
  error: "#F5222D",
  primary: "#000000",
  secondary: "#4F4F4F",
}

const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
  },
}

export default SwapPage
