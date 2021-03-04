import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { navigate } from "gatsby";
import * as React from "react";
import Logo from '../images/icon.svg';
import { Wallet } from './Wallet';

// markup
export const Header : React.FC = () => {
  const goToIndex = () => {
    navigate("/");
  }

  const goToReview = () => {
    navigate("/review");
  }

  const goToMint = () => {
    navigate("/mint");
  }

  return (
    <Layout.Header style={styles.header}>
      <Logo style={styles.logo} onClick={goToIndex} />
      <div>
        <Button
          onClick={goToReview}
          style={styles.button}
          type="text"
          size="large">
            Review
        </Button>
        <Button
          onClick={goToMint}
          style={styles.button}
          type="primary"
          size="large"
          shape="round"
          icon={<PlusOutlined />}>
            Mint
        </Button>
        <Wallet />
      </div>
    </Layout.Header>
  )
}

const styles : {[key: string]: React.CSSProperties} = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 172,
    height: 40,
    cursor: "pointer",
  },
  button: {
    marginLeft: 24,
    marginRight: 24,
  },
}
