import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from "@web3-react/core";
import Layout, { Content } from "antd/lib/layout/layout";
import { PageProps } from 'gatsby';
import * as React from "react";
import { Header } from '../components/Header';
import { MultiMagnetForm } from '../components/mint/MultiMagnetForm';
import { ThemeProvider } from '../components/ThemeProvider';
import { MagnetDefinition } from '../types/magnet';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

// markup
const MintPage : React.FC<PageProps> = (props) => {
  const initialSelection = (() : MagnetDefinition["type"] | undefined => {
    const passedSelection = (props.location.state as any)?.initialSelection;
    if (passedSelection === "vest" || passedSelection === "stream" || passedSelection === "gift") {
      return passedSelection;
    }
    return undefined;
  })();

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider>
        <Layout>
          <Header />
          <Content  style={styles.content}>
            <div style={styles.title}>Attract and retain contributors</div>
            <div style={styles.tip}>You can mint (create) vesting, streaming, or gift magnets. Feel free to mix and match!</div>
            <div style={styles.mintTitle}>Mint Magnets</div>
            <MultiMagnetForm initialSelection={initialSelection}/>
          </Content>
        </Layout>
      </ThemeProvider>
    </Web3ReactProvider>
  );
}

export default MintPage

const styles : {[key: string]: React.CSSProperties} = {
  content: {
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
  tip: {
    backgroundColor: "#E6F7FF",
    borderRadius: 12,
    fontSize: 16,
    maxWidth: 517,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 48,
    marginBottom: 48
  },
  mintTitle: {
    fontSize: 36,
    fontWeight: 600,
  },
}
