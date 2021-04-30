import { Button } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { navigate } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import { Header } from '../components/Header';

// markup
const NotFoundPage = () => {
  const goToHome = () => {
    navigate("/");
  }

  return (
    <Layout>
      <Helmet>
        <title>Magnet</title>
      </Helmet>
      <Header />
      <Content  style={styles.content}>
        <div style={styles.error}>Page not found</div>
        <Button
          onClick={() => goToHome()}
          style={styles.goHomeButton}
          type="primary"
          size="large">
          Go home
        </Button>
      </Content>
    </Layout>
  )
}

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
  },
  error: {
    marginTop: 128,
    fontSize: 36,
  },
  goHomeButton: {
    marginTop: 20,
  },
}

export default NotFoundPage
