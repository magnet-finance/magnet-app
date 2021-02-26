import { Layout } from 'antd';
import * as React from "react";
import { Header } from '../components/Header';
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
          <div style={styles.mintTitle}>Mint Magnets</div>
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
  mintTitle: {
    fontSize: 36,
    fontWeight: 600,
  },
}
