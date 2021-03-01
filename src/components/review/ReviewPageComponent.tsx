import Layout, { Content } from "antd/lib/layout/layout";
import * as React from "react";
import { Header } from "../Header";
import { ThemeProvider } from "../ThemeProvider";
import { ReviewRecipientCard } from "./RecipientCard";

export const ReviewPageComponent: React.FC = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Header />
        <Content  style={styles.content}>
          <div style={styles.title}>Review Mint Transaction</div>
          <ReviewRecipientCard recipient="0xmaki.eth" />
        </Content>
      </Layout>
    </ThemeProvider>
  );
}

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
    fontWeight: 600,
    lineHeight: "44px",
    marginBottom: 48,
  },
}
