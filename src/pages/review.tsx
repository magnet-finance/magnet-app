import Layout from "antd/lib/layout/layout";
import * as React from "react";
import { Header } from "../components/Header";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';

type Props = {
  safeTxHash?: string
}

const ReviewPage : React.FC<Props>= ({safeTxHash}) => {
  return (
    <Layout>
      <Header />
      <ReviewPageComponent safeTxHash={safeTxHash} />
    </Layout>
  );
}

export default ReviewPage
