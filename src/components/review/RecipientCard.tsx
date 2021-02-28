import { Card } from "antd";
import * as React from "react";
import { Address } from "../Address";
import { RecurringMagnetTable } from "./RecurringMagnetTable";

type Props = {
  address: string;
}

export const ReviewRecipientCard: React.FC<Props> = (props) => {
  return (
    <Card bodyStyle={styles.cardBody}>
      <Address address={props.address} />
      <RecurringMagnetTable address={props.address} />
    </Card>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  cardBody: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 6,
  },
}
