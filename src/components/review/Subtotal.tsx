import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import groupBy from "lodash/groupBy";
import mapValues from 'lodash/mapValues';
import sumBy from "lodash/sumBy";
import values from "lodash/values";
import 'moment-duration-format';
import * as React from "react";
import { MagnetDefinition } from "../../types/magnet";
import { TokenLabel } from "../TokenLabel";

type Props = {
  magnets: MagnetDefinition[],
}

type Subtotal = {
  key: string,
  amount: number,
  tokenType: string,
}

export const Subtotal: React.FC<Props> = (props) => {
  const columns: ColumnsType<Subtotal> = [
    {
      title: <span style={styles.header}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => <>{record.amount.toLocaleString()}</>,
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (text, record) => <TokenLabel address={record.tokenType} />,
    },
  ];

  const magnetsByToken = groupBy(props.magnets, "tokenType");
  const subtotals = values(mapValues(magnetsByToken, (magnets, tokenType) => {
    return {
      key: `subtotal-${tokenType}`,
      amount: sumBy(magnets, "lifetimeValue"),
      tokenType
    }
  }));

  return (
    <Table
      style={styles.table}
      columns={columns}
      dataSource={subtotals}
      pagination={false} />
  );
}

const styles : {[key: string]: React.CSSProperties} = {
  table: {
    marginTop: 24,
    borderStyle: "solid solid none solid",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 6,
    overflow: "hidden",
    width: "min-content",
  },
  header: {
    fontWeight: 600,
  },
}
