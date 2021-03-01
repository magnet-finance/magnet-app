import { TwitterOutlined } from '@ant-design/icons';
import { Button, Card, Image } from "antd";
import moment from 'moment';
import 'moment-duration-format';
import * as React from "react";
import { TokenLabel } from "../TokenLabel";


type Props = {
  recipient: string;
}

export const GiftMagnet: React.FC<Props> = (props) => {
  const imageUrl = "https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg";
  const giftName = "pedrowww's launch bonus";
  const message = "Thank you for contributing to the Sushi launch! We’re glad to have you in the community.";
  const timestamp = moment().local().format('MMMM Do YYYY, h:mm:ss a');
  const amount = 1000;
  const tokenAddress = "DAI";

  const shareOnTwitter = () => {
    const text = "Congrats to " + props.recipient + "%0A%0A" + message;
    window.open("https://twitter.com/intent/tweet?text=" + text);
  }

  return (
    <Card style={styles.card} bodyStyle={styles.cardBody}>
      <Image
        style={styles.image}
        src={imageUrl}
        width="30%" />
      <div style={styles.info}>
        <div style={styles.name}>
          {giftName}
        </div>
        <div style={styles.timestamp}>
          {timestamp}
        </div>
        <div style={styles.message}>
          {message}
        </div>
        <div style={styles.amount}>
          <span style={styles.number}>{amount}</span>
          <TokenLabel address={tokenAddress} />
        </div>
        <Button
          style={styles.twitter}
          type="text"
          icon={<TwitterOutlined />}
          onClick={shareOnTwitter}>
            <span style={styles.twitterText}>Share on Twitter</span>
        </Button>
      </div>
    </Card>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  card: {
    borderRadius: 6,
    marginTop: 24,
  },
  cardBody: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    display: "flex",
  },
  image: {
    borderRadius: 6,
  },
  info: {
    marginLeft: 48,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "24px",
  },
  timestamp: {
    fontSize: 12,
    fontWeight: 300,
    lineHeight: "20px",
    color: "#8C8C8C",
  },
  message: {
    fontSize: 14,
    lineHeight: "22px",
    marginTop: 16,
  },
  amount: {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
  },
  number: {
    marginRight: 16,
  },
  twitter: {
    marginTop: 12,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  twitterText: {
    fontSize: 12,
  }
}
