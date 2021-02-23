import * as React from "react";
import "antd/dist/antd.css";
import { Image, Layout, Menu } from 'antd';
import logoPng from '../images/icon.png';

const { Header, Content } = Layout;

// markup
const IndexPage = () => {
  
  return (
    <Layout className="layout">
      <Header>
        <Image height={48} width={48} src={logoPng} preview={false} />
        <Menu mode="horizontal">
          <Menu.Item key="Mint">Mint</Menu.Item>
          <Menu.Item key="Review">Review</Menu.Item>
        </Menu>
      </Header>
      <Content  style={{ padding: '64px 146px'}}>
        <div>Hello world</div>
      </Content>
    </Layout>
  )
}

export default IndexPage

// styles
const pageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}