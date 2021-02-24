import { Layout } from 'antd';
import "antd/dist/antd.css";
import * as React from "react";
import { Header } from '../components/Header';

const { Content } = Layout;

// markup
const ReviewPage = () => {
  return (
    <Layout>
      <Header />
      <Content  style={styles.content}>
        <div style={styles.title}>Review proposed deposit</div>
      </Content>
    </Layout>
  )
}

export default ReviewPage

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
  },
}
