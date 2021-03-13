import { Button } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import moment from 'moment';
import * as React from "react";
import { MagnetDefinition } from "../../types/magnet";
import { Header } from "../Header";
import { RecipientCard } from "./RecipientCard";
import { Subtotal } from "./Subtotal";

export const ReviewPageComponent: React.FC = () => {
  const signTransaction = () => {
    console.log("signing transaction");
  }

  /** Spoof magnet data for now */
  const now = moment();
  const cliff = moment(now).add(1,'y');
  const end = moment(now).add(4,'y');
  const magnets: MagnetDefinition[] = [
    {
      type: "vest",
      recipient: "0xmaki.eth",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: BigNumber.from(20000),
      tokenType: "SUSHI",
    },
    {
      type: "stream",
      recipient: "0xmaki.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000),
      tokenType: 'DAI',
    },
    {
      type: "gift",
      recipient: "pedrowww.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000),
      tokenType: "DAI",
    },
    {
      type: "vest",
      recipient: "0xmaki.eth",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: BigNumber.from(20000),
      tokenType: "SUSHI",
    },
    {
      type: "gift",
      recipient: "0xmaki.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000),
      tokenType: "DAI",
    },
    {
      type: "stream",
      recipient: "pedrowww.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000),
      tokenType: 'DAI',
    },
  ];

  const groupedMagnets = groupBy(magnets, "recipient");

  return (
    <Layout>
      <Header />
      <Content  style={styles.content}>
        <div style={styles.title}>Review Mint Transaction</div>
        {map(groupedMagnets, (magnets, recipient) =>
          <RecipientCard key={`recipient-card-${recipient}`} recipient={recipient} magnets={magnets} />
        )}
        <div style={styles.subtitle}>Total</div>
        <Subtotal magnets={magnets} />
        <Button
          onClick={signTransaction}
          style={styles.button}
          type="primary"
          size="large">
          Sign Transaction
        </Button>
      </Content>
    </Layout>
  );
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
