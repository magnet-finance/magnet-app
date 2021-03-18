import Layout from "antd/lib/layout/layout";
import * as React from "react";
import { Header } from "../components/Header";
import { ReviewPageComponent } from '../components/review/ReviewPageComponent';

// markup
const ReviewPage = () => {
  return (
    <Layout>
      <Header />
      <ReviewPageComponent />
    </Layout>
  );
}

export default ReviewPage
