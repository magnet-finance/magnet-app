import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { navigate } from "gatsby";
import * as React from "react";
import logoPng from '../images/icon.png';

// markup
export const Header : React.FC = () => {
  const goToIndex = () => {
    navigate("/");
  }

  const goToMint = () => {
    navigate("/mint");
  }

  const goToReview = () => {
    navigate("/review");
  }

  return (
    <Layout.Header style={styles.header}>
      <img src={logoPng} style={styles.logo} onClick={goToIndex}/>
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
    width: 40,
    height: 40,
    flex: 0,
    cursor: "pointer",
  },
  button: {
    marginLeft: 24,
    marginRight: 24,
  },
}
