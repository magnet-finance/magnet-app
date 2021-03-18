import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from "@web3-react/core";
import { Button, Card, Skeleton } from "antd";
import { Content } from "antd/lib/layout/layout";
import { BigNumber } from "ethers";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { GnosisLookupError, GnosisLookupResult, lookupGnosisTxn } from '../../logic/gnosisManager';
import { getTokenManager, TokenManager } from "../../logic/tokenManager";
import { MagnetDefinition } from "../../types/magnet";
import { Web3ReactContext } from '../../types/web3ReactContext';
import { Wallet } from '../Wallet';
import { RecipientCard } from "./RecipientCard";
import { Subtotal } from "./Subtotal";


type Props = {
  safeTxHash?: string
}

export const ReviewPageComponent: React.FC<Props> = ({safeTxHash}) => {
  const [ gnosisResult, setGnosisResult ] = useState<GnosisLookupResult | GnosisLookupError | undefined>(undefined);
  const web3 = useWeb3React<Web3Provider>();

  useEffect(() => {
    (async () => {
      if (safeTxHash != null && safeTxHash !== ""){
        setGnosisResult(await lookupGnosisTxn(safeTxHash));
      }
    })()
  }, []);

  // Note use better logic to check hash
  if (safeTxHash == null || safeTxHash === "") {
    return <div>No Hash Provided</div>
  }

  if (gnosisResult == null) {
    return (
      <Content style={styles.content}>
        <div style={styles.title}>Review Mint Transaction</div>
        <Card style={styles.loadingCard} bodyStyle={styles.loadingCardBody}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      </Content>
    );
  }
  else if (gnosisResult.successful === false) {
    return <div>error</div>
  }
  else {
    const magnets = gnosisResult.magnets;
    const signTransaction = () => {
      console.log("signing transaction");
    }

    const groupedMagnets = groupBy(magnets, "recipient");

    return (
      <Content style={styles.content}>
        <div style={styles.title}>Review Mint Transaction</div>
        {map(groupedMagnets, (magnetsForRecipient, recipient) =>
          <RecipientCard key={`recipient-card-${recipient}`} recipient={recipient} magnets={magnetsForRecipient} />
        )}
        <div style={styles.subtitle}>Total</div>
        <Subtotal magnets={magnets} />
        {web3.chainId ? (
          <Button
            onClick={signTransaction}
            style={styles.signButton}
            type="primary"
            size="large">
            Sign Transaction
          </Button>
        ) : (
          <Wallet style={styles.connectWalletButton} />
        )}
      </Content>
    );
  }
}

const loadMagnetsData = (web3: Web3ReactContext | undefined) : MagnetDefinition[] | undefined => {
  let tokenManager: TokenManager | undefined;
  if (web3 == null || web3.chainId == null) {
    tokenManager = getTokenManager(1); // TODO infer chain ID from gnosis data
  } else {
    tokenManager = getTokenManager(web3);
  }

  if (tokenManager == null) {
    console.error("Load Review Magnets Error: Unknown Chain ID");
    return undefined;
  }

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
      lifetimeValue: BigNumber.from(20000).mul(BigNumber.from(10).pow(18)),
      token: tokenManager.getTokenInfoBySymbol("SUSHI") ?? tokenManager.tokens[0],
    },
    {
      type: "stream",
      recipient: "0xmaki.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000).mul(BigNumber.from(10).pow(18)),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "gift",
      recipient: "pedrowww.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000).mul(BigNumber.from(10).pow(18)),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "vest",
      recipient: "0xmaki.eth",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: BigNumber.from(20000).mul(BigNumber.from(10).pow(18)),
      token: tokenManager.getTokenInfoBySymbol("SUSHI") ?? tokenManager.tokens[0],
    },
    {
      type: "gift",
      recipient: "0xmaki.eth",
      giftImageUrl: "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg",
      giftName: "pedrowww's launch bonus",
      giftMessage: "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.",
      sendTime: now,
      lifetimeValue: BigNumber.from(1000).mul(BigNumber.from(10).pow(18)),
      token: tokenManager.getTokenInfoBySymbol("DAI") ?? tokenManager.tokens[0],
    },
    {
      type: "stream",
      recipient: "pedrowww.eth",
      startTime: now,
      endTime: end,
      lifetimeValue: BigNumber.from(600000).mul(BigNumber.from(10).pow(18)),
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
  loadingCard: {
    borderRadius: 6,
    marginTop: 32,
  },
  loadingCardBody: {
    paddingTop: 32,
    paddingBottom: 30,
    paddingLeft: 32,
    paddingRight: 64,
  },
  connectWalletButton: {
    borderColor: "#1890ff",
    marginTop: 48
  },
  signButton: {
    marginTop: 48,
  }
}
