import Layout from "antd/lib/layout/layout";
import { PageProps } from 'gatsby';
import * as React from "react";
import { Helmet } from "react-helmet";
import { Header } from "../components/Header";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';

type Props = PageProps & {
  mintSuccess?: boolean,
  safeTxHash?: string
}

const ReviewPage : React.FC<Props>= (props) => {
  const mintSuccess = (props.location.state as any)?.mintSuccess;

  return (
    <Layout>
      <Helmet>
        <title>Magnet</title>
      </Helmet>
      <Header />
      <ReviewPageComponent safeTxHash={props.safeTxHash} mintSuccess={mintSuccess} />
    </Layout>
  );
}

export default ReviewPage
