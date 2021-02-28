import { TwitterCircleFilled } from '@ant-design/icons';
import { Button, Card, Image } from "antd";
import moment from 'moment';
import 'moment-duration-format';
import * as React from "react";
import { TokenLabel } from "../TokenLabel";


type Props = {
  address: string;
}

export const GiftMagnet: React.FC<Props> = (props) => {
  return (
    <Card style={styles.card} bodyStyle={styles.cardBody}>
      <Image
        style={styles.image}
        src="https://news.bitcoin.com/wp-content/uploads/2019/01/sushiswap1.jpg" />
      <div style={styles.info}>
        <div style={styles.name}>
          pedrowww's launch bonus
        </div>
        <div style={styles.message}>
          blahlasjf laksjdf laksjdf laksjd flaksj dflkajsd flksjd flkj dslkfj dskjf dkjsf sdkfj skdjf skldjf lskdjf lkj fdkj sdflkj sdlfk jlkj
        </div>
        <div style={styles.message}>
          {moment().local().format('MMMM Do YYYY, h:mm:ss a')}
        </div>
        <div style={styles.amount}>
          <span style={styles.number}>1,000</span>
          <TokenLabel address="dai" />
        </div>
        <Button
          style={styles.twitter}
          type="text"
          size="small"
          icon={<TwitterCircleFilled />}>
          Share on Twitter
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
    flexGrow: 1,
  },
  info: {
    flexGrow: 2,
    marginLeft: 48,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "24px",
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
    marginTop: 16,
    paddingLeft: 0,
    paddingRight: 0,
  },
}
