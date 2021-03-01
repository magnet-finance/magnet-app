import { Card } from "antd";
import * as React from "react";
import { GiftMagnetDefinition, MagnetDefinition, RecurringMagnetDefinition } from "../../types/magnet";
import { Address } from "../Address";
import { GiftMagnet } from "./GiftMagnet";
import { RecurringMagnetTable } from "./RecurringMagnetTable";

type Props = {
  recipient: string,
  magnets: MagnetDefinition[],
}

export const RecipientCard: React.FC<Props> = (props: Props) => {
  const recurringMagnets = props.magnets.filter(magnet =>
    magnet.type == "vest" || magnet.type == "stream"
  ) as RecurringMagnetDefinition[];

  const giftMagnets = props.magnets.filter(magnet =>
    magnet.type == "gift"
  ) as GiftMagnetDefinition[];

  return (
    <Card style={styles.card} bodyStyle={styles.cardBody}>
      <Address address={props.recipient} />
      {recurringMagnets.length > 0 &&
        <RecurringMagnetTable recipient={props.recipient} magnets={recurringMagnets} />
      }
      {giftMagnets.map((gift, i) =>
        <GiftMagnet key={`review-gift-${props.recipient}-${i}`} gift={gift} />
      )}
    </Card>
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  card: {
    borderRadius: 6,
    marginTop: 32,
  },
  cardBody: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 32,
    paddingRight: 32,
  },
}
