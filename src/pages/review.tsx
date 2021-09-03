import { Button, Form, Input } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import { navigate, PageProps } from 'gatsby';
import * as React from "react";
import { Helmet } from "react-helmet";
import { Footer } from '../components/Footer';
import { Header } from "../components/Header";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';

type Props = PageProps & {
  mintSuccess?: boolean,
  safeTxHash?: string
}

const ReviewPage : React.FC<Props>= (props) => {
  const mintSuccess = (props.location.state as any)?.mintSuccess;

  const goToSafeHash = (values: any) => {
    navigate(`/review/${values.safeTxHash}`)
  };

  return (
    <Layout style={styles.layout}>
      <Helmet>
        <title>Magnet</title>
      </Helmet>
      <Header />
      {props.safeTxHash ? (
        <ReviewPageComponent safeTxHash={props.safeTxHash} mintSuccess={mintSuccess} />
      ) : (
        <Content style={styles.content}>
          <div style={styles.title}>Enter the Gnosis SafeTxHash for review</div>
          <Form name="enter-safe-hash-form" onFinish={goToSafeHash}>
            <Form.Item name="safeTxHash" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item >
              <Button type="primary" htmlType="submit">
                Begin Review
              </Button>
            </Form.Item>
          </Form>
        </Content>
      )}
      <Footer />
    </Layout>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingLeft: 146,
    paddingRight: 146,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 20,
  }
}

export default ReviewPage
