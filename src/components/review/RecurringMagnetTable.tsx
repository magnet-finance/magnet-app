import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import moment from 'moment';
import 'moment-duration-format';
import * as React from "react";
import { StreamMagnetDefinition, VestMagnetDefinition } from "../../types/magnet";
import { TokenLabel } from "../TokenLabel";

type Props = {
  recipient: string;
}

type RecurringMagnet = VestMagnetDefinition | StreamMagnetDefinition;

export const RecurringMagnetTable: React.FC<Props> = (props) => {
  const columns: ColumnsType<RecurringMagnet> = [
    {
      title: <span style={styles.header}>Type</span>,
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span style={styles.capitalize}>{text}</span>,
    },
    {
      title: <span style={styles.header}>Start</span>,
      dataIndex: 'start',
      key: 'start',
      render: (text, record) => <>{record.startTime.local().format('MMMM Do YYYY, h:mm:ss a')}</>,
    },
    {
      title: <span style={styles.header}>Cliff</span>,
      dataIndex: 'cliff',
      key: 'cliff',
      render: (text, record) => {
        if (record.type == "vest") {
          return <>{moment.duration(record.cliffTime.diff(record.startTime)).humanize().replace("a ", "1 ")}</>;
        } else {
          return <>-</>;
        }
      }
    },
    {
      title: <span style={styles.header}>End</span>,
      dataIndex: 'end',
      key: 'end',
      render: (text, record) => <>
        {moment.duration(record.endTime.diff(record.startTime)).humanize().replace("a ", "1 ")}
      </>,
    },
    {
      title: <span style={styles.header}>Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => <>
        {record.lifetimeValue.toLocaleString()}
      </>,
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (text, record) => <TokenLabel address={record.tokenType} />,
    },
  ];

  const now = moment();
  const cliff = moment(now).add(1,'y');
  const end = moment(now).add(4,'y');


  const data: RecurringMagnet[] = [
    {
      type: "vest",
      startTime: now,
      cliffTime: cliff,
      endTime: end,
      lifetimeValue: 20000,
      tokenType: "SUSHI",
    } as VestMagnetDefinition,
    {
      type: "stream",
      startTime: now,
      endTime: end,
      lifetimeValue: 600000,
      tokenType: 'DAI',
    } as StreamMagnetDefinition,
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
  capitalize: {
    textTransform: "capitalize",
  }
}
