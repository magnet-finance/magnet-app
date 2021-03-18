import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { getTokenManager, TokenManager } from "../../logic/tokenManager";
import { MagnetDefinition } from "../../types/magnet";
import { LoadingPageComponent } from '../LoadingPageComponent';
import { Wallet } from '../Wallet';
import { RecipientCard } from "./RecipientCard";
import { Subtotal } from "./Subtotal";

type Error = {
  error: string,
}

export const ReviewPageComponent: React.FC = () => {
  const [ magnets, setMagnets ] = useState<MagnetDefinition[] | Error | undefined>(undefined);
  useEffect(loadMagnetsData)

  if (magnets == null) {
    return <LoadingPageComponent/>
  }
  else if (magnets instanceof Error) {
    return <div>error</div>
  }
  else {
    const web3 = useWeb3React<Web3Provider>();
    let tokenManager = getTokenManager(web3);

    const loadedMagnets = loadMagnetsData(tokenManager);
    const groupedMagnets = groupBy(magnets, "recipient");

    const signTransaction = () => {
      console.log("signing transaction");
    }

    return (
      <Content  style={styles.content}>
        <div style={styles.title}>Review Mint Transaction</div>
        {map(groupedMagnets, (magnets, recipient) =>
          <RecipientCard key={`recipient-card-${recipient}`} recipient={recipient} magnets={magnets} />
        )}
        <div style={styles.subtitle}>Total</div>
        <Subtotal magnets={magnets} />
        {web3.chainId ? (
          <Button
            onClick={signTransaction}
            style={styles.button}
            type="primary"
            size="large">
            Sign Transaction
          </Button>
        ) : (
          <Wallet />
        )}
      </Content>
    );
  }
  /**
   * TODO: create a state var 'magnets' to hold the data
   *
   * if magnets undefined - render loading page
   * if error - render error page (where to store error in state?)
   *    subcase: if error was chainId is other net, then show message to switch chains
   * if magnets defined - render page
   *    *
   */
}

const loadMagnetsData = (tokenManager: TokenManager | undefined) : MagnetDefinition[] => {
  /** Spoof magnet data for now */
  const now = moment();
  const cliff = moment(now).add(1,'y');
  const end = moment(now).add(4,'y');
  const parsedMagnets: MagnetDefinition[] = [
    {
      type: "vest",
      recipient: "0xmaki.eth",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: BigNumber.from(20000),
      token: tokenManager.getTokenInfoBySymbol("SUSHI") ?? tokenManager.tokens[0],
    },
    {
      type: "stream",
      recipient: "0xmaki.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "gift",
      recipient: "pedrowww.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "vest",
      recipient: "0xmaki.eth",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: BigNumber.from(20000),
      token: tokenManager.getTokenInfoBySymbol("SUSHI") ?? tokenManager.tokens[0],
    },
    {
      type: "gift",
      recipient: "0xmaki.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "stream",
      recipient: "pedrowww.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
  ];
  return parsedMagnets;
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  },
  title: {
    fontSize: 36,
    fontWeight: 600,
    lineHeight: "44px",
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: 600,
    lineHeight: "38px",
    marginTop: 48,
    marginBottom: 24,
  },
  button: {
    marginTop: 48,
  }
}
