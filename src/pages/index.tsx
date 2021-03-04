import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import { Button } from 'antd';
import Layout, { Content } from "antd/lib/layout/layout";
import { navigate } from "gatsby";
import * as React from "react";
import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';
import GiftGraphic from '../images/gift.svg';
import SablierLogo from '../images/sablier.svg';
import StreamGraphic from '../images/stream.svg';
import VestGraphic from '../images/vest.svg';
import YfiLogo from '../images/yfi.svg';
import YgiftLogo from '../images/ygift.svg';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

// markup
const IndexPage = () => {
  const goToMint = (selection: string) => {
    navigate("/mint", {
      state: {
        initialSelection: selection,
       },
    });
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider>
        <Layout>
          <Header />
          <Content  style={styles.content}>
            <div style={styles.title}>Magnetize your Mission.</div>
            <div style={styles.subtitle}>Attract and retain contributors</div>
            <div style={styles.subsubtitle}>Choose a magnet</div>
            <div style={styles.cardContainer}>
              <div style={styles.card}>
                <VestGraphic style={styles.cardLogo} />
                <div style={styles.cardTitle}>
                  Vest
                </div>
                <div style={styles.cardDescription}>
                  Vest retention packages with a cliff date and any ERC20 token
                </div>
                <div style={styles.attributionContainer}>
                  <YfiLogo style={styles.attributionLogo} />
                  <div style={styles.attributionText}>
                    Vested via Yearn Escrow
                  </div>
                </div>
                <Button
                  onClick={() => goToMint("vest")}
                  style={styles.cardButton}
                  type="primary"
                  size="large">
                  Mint
                </Button>
              </div>
              <div style={styles.card}>
                <StreamGraphic style={styles.cardLogo} />
                <div style={styles.cardTitle}>
                  Stream
                </div>
                <div style={styles.cardDescription}>
                  Stream salaries in real-time with any ERC20 token
                </div>
                <div style={styles.attributionContainer}>
                  <SablierLogo style={styles.attributionLogo} />
                  <div style={styles.attributionText}>
                    Streamed via Sablier
                  </div>
                </div>
                <Button
                  onClick={() => goToMint("stream")}
                  style={styles.cardButton}
                  type="primary"
                  size="large">
                  Mint
                </Button>
              </div>
              <div style={styles.card}>
                <GiftGraphic style={styles.cardLogo} />
                <div style={styles.cardTitle}>
                  Gift
                </div>
                <div style={styles.cardDescription}>
                  Gift ERC20 tokens, memes, and a message of gratitude
                </div>
                <div style={styles.attributionContainer}>
                  <YgiftLogo style={styles.attributionLogo} />
                  <div style={styles.attributionText}>
                    Gifted via yGift
                  </div>
                </div>
                <Button
                  onClick={() => goToMint("gift")}
                  style={styles.cardButton}
                  type="primary"
                  size="large">
                  Mint
                </Button>
              </div>
            </div>
            <Button
              onClick={() => goToMint("")}
              style={styles.mintMultipleButton}
              size="large"
              type="primary"
              ghost={true}>
              Mint Multiple
            </Button>
          </Content>
        </Layout>
      </ThemeProvider>
    </Web3ReactProvider>
  )
}

export default IndexPage

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
  },
  title: {
    fontSize: 56,
    lineHeight: "64px",
    fontWeight: 600,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 300,
    marginTop: 8,
    color: "#8C8C8C",
  },
  subsubtitle: {
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 600,
    color: "#1890FF",
    marginTop: 54,
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 32,
  },
  card: {
    width: 326,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginLeft: 56,
    marginRight: 56,
    textAlign: "center",
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,

  },
  cardTitle: {
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 600,
    marginTop: 18,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: "22px",
    fontWeight: 300,
    color: "#4F4F4F",
    marginTop: 20,
  },
  attributionContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  attributionLogo: {
    width: 16,
    height: 16,
  },
  attributionText: {
    fontSize: 12,
    fontWeight: 300,
    color: "#595959",
    marginLeft: 8,
  },
  cardButton: {
    marginTop: 20,
  },
  cardLogo: {
    width: 100,
    height: 100,
  },
  mintMultipleButton: {
    marginTop: 48,
  }
}
