import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { BigNumber } from 'ethers';
import groupBy from "lodash/groupBy";
import mapValues from 'lodash/mapValues';
import reduce from 'lodash/reduce';
import values from "lodash/values";
import 'moment-duration-format';
import * as React from "react";
import { formatBigNumber } from "../../logic/tokenManager";
import { MagnetDefinition } from "../../types/magnet";
import { TokenInfo } from "../../types/token";
import { TokenLabel } from "../TokenLabel";

type Props = {
  magnets: MagnetDefinition[],
}

type Subtotal = {
  key: string,
  amount: BigNumber,
  token: TokenInfo,
}

export const Subtotal: React.FC<Props> = (props) => {
  const columns: ColumnsType<Subtotal> = [
    {
      title: <span style={styles.header}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: BigNumber, record) => <>{formatBigNumber(amount, record.token.decimals)}</>,
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (token: TokenInfo) => <TokenLabel token={token}/>,
    },
  ];

  const magnetsByToken = groupBy(props.magnets, "token.address");
  const subtotals = values(mapValues(magnetsByToken, (magnets, tokenAddress) => {
    const amount = reduce(magnets, (acc, m) => acc.add(m.lifetimeValue), BigNumber.from(0));
    return {
      key: `subtotal-${tokenAddress}`,
      amount: amount,
      token: magnets[0].token,
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
