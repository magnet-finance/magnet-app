import { Button, Layout } from 'antd';
import { navigate } from "gatsby";
import * as React from "react";
import { Header } from '../components/Header';
import { ThemeProvider } from '../components/ThemeProvider';

const { Content } = Layout;

// markup
const IndexPage = () => {
  const goToMint = () => {
    navigate("/mint");
  }

  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Content  style={styles.content}>
          <div style={styles.title}>Magnetize your Mission.</div>
          <div style={styles.subtitle}>Attract and retain contributors</div>
          <div style={styles.subsubtitle}>Choose a magnet</div>
          <div style={styles.cardContainer}>
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                Vest
              </div>
              <div style={styles.cardDescription}>
                Vest retention packages with a custom cliff date.
              </div>
              <div style={styles.attribution}>
                via Magnet
              </div>
              <Button
                onClick={goToMint}
                style={styles.cardButton}
                type="primary">
                Mint
              </Button>
            </div>
            <div style={styles.card}></div>
            <div style={styles.card}></div>
          </div>
          <Button
            onClick={goToMint}
            style={styles.mintMultipleButton}
            size="large"
            type="primary"
            ghost={true}>
              Mint Multiple
          </Button>
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
    height: 374,
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
    fontWeight: 600,
    marginTop: 24,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: "22px",
    color: "#4F4F4F",
    marginTop: 20,
  },
  attribution: {
    color: "#595959",
    marginTop: 12,
  },
  cardButton: {
    marginTop: 12,
  },
  mintMultipleButton: {
    marginTop: 48,
  }
}
