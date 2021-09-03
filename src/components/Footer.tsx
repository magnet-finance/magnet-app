import { Layout } from 'antd';
import * as React from "react";
import { GithubOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Link from "gatsby-link";

// markup
export const Footer : React.FC = () => {
  return (
    <Layout.Footer style={styles.footer}>
      <div style={styles.footerButtonGroup}>
        <Link
          to="https://twitter.com/WillHennessy_/status/1391646532697481220"
          target="_blank">
            {<InfoCircleOutlined style={styles.footerButton}/>}
        </Link>
        <Link
          to="https://github.com/magnet-finance/magnet-app"
          target="_blank">
            {<GithubOutlined style={styles.footerButton}/>}
        </Link>
      </div>
    </Layout.Footer>
  )
}

const styles : {[key: string]: React.CSSProperties} = {
  footer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  footerButtonGroup: {
    display: "flex",
    alignItems: "center",
  },
  footerButton: {
    fontSize: "20px",
    color: "#4F4F4F",
    padding: "12px",
  },
}
