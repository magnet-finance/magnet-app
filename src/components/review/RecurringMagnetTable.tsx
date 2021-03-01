import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from 'moment';
import 'moment-duration-format';
import * as React from "react";
import { TokenLabel } from "../TokenLabel";

type Props = {
  recipient: string;
}

type RecurringMagnet = {
  type: string;
  start: moment.Moment;
  cliff: moment.Moment;
  end: moment.Moment;
  amount: number;
  token: string;
}

export const RecurringMagnetTable: React.FC<Props> = (props) => {
  const columns: ColumnsType<RecurringMagnet> = [
    {
      title: <span style={styles.header}>Type</span>,
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: <span style={styles.header}>Start</span>,
      dataIndex: 'start',
      key: 'start',
      render: (text, record) => <>{record.start.local().format('MMMM Do YYYY, h:mm:ss a')}</>,
    },
    {
      title: <span style={styles.header}>Cliff</span>,
      dataIndex: 'cliff',
      key: 'cliff',
      render: (text, record) => <>
        {moment.duration(record.cliff.diff(record.start)).humanize().replace("a ", "1 ")}
      </>,
    },
    {
      title: <span style={styles.header}>End</span>,
      dataIndex: 'end',
      key: 'end',
      render: (text, record) => <>
        {moment.duration(record.end.diff(record.start)).humanize().replace("a ", "1 ")}
      </>,
    },
    {
      title: <span style={styles.header}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => <>
        {record.amount.toLocaleString()}
      </>,
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (text, record) => <TokenLabel address={record.token} />,
    },
  ];

  const now = moment();
  const cliff = moment(now).add(1,'y');
  const end = moment(now).add(4,'y')

  const data: RecurringMagnet[] = [
    {
      type: 'Vest',
      start: now,
      cliff: cliff,
      end: end,
      amount: 20000,
      token: 'SUSHI',
    },
    {
      type: 'Stream',
      start: now,
      cliff: cliff,
      end: end,
      amount: 600000,
      token: 'DAI',
    },
  ];

  return (
    <Table
      style={styles.table}
      columns={columns}
      dataSource={data}
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
  },
  header: {
    fontWeight: 600,
  },
}
