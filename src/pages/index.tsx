import { Layout } from 'antd';
import * as React from "react";
import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';

const { Content } = Layout;

// markup
const IndexPage = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Content  style={styles.content}>
          <div style={styles.title}>Magnetize your Mission.</div>
          <div style={styles.subtitle}>Attract and retain contributors</div>
          <div style={styles.choose}>Choose a magnet</div>
        </Content>
      </Layout>
    </ThemeProvider>
  )
}

export default IndexPage

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  },
  title: {
    fontSize: 56,
    fontWeight: 600,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#828282",
  },
  choose: {
    fontSize: 24,
    fontWeight: 600,
    textAlign: "center",
    color: "#1890FF",
    marginTop: 45,
  }
}
