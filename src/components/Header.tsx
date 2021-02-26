import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout } from 'antd';
import { graphql, navigate, useStaticQuery } from "gatsby";
import Img from 'gatsby-image';
import * as React from "react";

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

  const imgData = useStaticQuery(graphql`
  query {
    image: file(relativePath: { eq: "icon.png" }) {
      childImageSharp {
        fixed(width: 40, height: 40) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`);

  return (
    <Layout.Header style={styles.header}>
      <div style={styles.logo} onClick={goToIndex}>
        <Img fixed={imgData.image.childImageSharp.fixed}/>
      </div>
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
