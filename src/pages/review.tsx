import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import Layout from "antd/lib/layout/layout";
import * as React from "react";
import { Header } from "../components/Header";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';
import { WalletConnectPageComponent } from "../components/WalletConnectPageComponent";

// markup
const ReviewPage = () => {
  const web3 = useWeb3React<Web3Provider>();

  return (
    <Layout>
      <Header />
      {web3.chainId ? (
        <ReviewPageComponent />
      ) : (
        <WalletConnectPageComponent />
      )}
    </Layout>
  );
}

export default ReviewPage
