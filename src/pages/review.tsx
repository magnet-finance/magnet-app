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
        <div>Review page</div>
      </Content>
    </Layout>
  )
}

export default ReviewPage

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  }
}
