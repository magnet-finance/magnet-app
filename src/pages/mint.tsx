import { Layout } from 'antd';
import * as React from "react";
import { Header } from '../components/Header';
import { MultiMagnetForm } from '../components/mint/MultiMagnetForm';
import { ThemeProvider } from '../components/ThemeProvider';

const { Content } = Layout;

// markup
const MintPage = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Content  style={styles.content}>
          <div style={styles.title}>Attract and retain contributors</div>
          <div style={styles.tip}>Tip: This is where you mint (create) new magnets. You can mint a vesting, streaming, or bonus magnet. Feel free to mix and match!</div>
          <div style={styles.mintTitle}>Mint Magnets</div>
          <MultiMagnetForm />
        </Content>
      </Layout>
    </ThemeProvider>
  )
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
    maxWidth: 580,
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
