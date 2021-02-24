import { Layout } from 'antd';
import "antd/dist/antd.css";
import * as React from "react";
import { Header } from '../components/Header';

const { Content } = Layout;

// markup
const IndexPage = () => {
  return (
    <Layout>
      <Header />
      <Content  style={styles.content}>
        <div>Hello world</div>
      </Content>
    </Layout>
  )
}

export default IndexPage

const styles : {[key: string]: React.CSSProperties} = {
  content: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  }
}
