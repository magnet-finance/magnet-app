import { Card } from "antd";
import * as React from "react";
import { Address } from "../Address";
import { GiftMagnet } from "./GiftMagnet";
import { RecurringMagnetTable } from "./RecurringMagnetTable";

type Props = {
  recipient: string;
}

export const RecipientCard: React.FC<Props> = (props) => {
  return (
    <Card style={styles.card} bodyStyle={styles.cardBody}>
      <Address address={props.recipient} />
      <RecurringMagnetTable recipient={props.recipient} />
      <GiftMagnet recipient={props.recipient} />
    </Card>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  card: {
    borderRadius: 6,
  },
  cardBody: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
  },
}
