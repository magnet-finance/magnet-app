import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { map } from "lodash";
import moment, { Moment } from 'moment';
import 'moment-duration-format';
import * as React from "react";
import { maybeGetMagnetTypeDisplayName, RecurringMagnetDefinition } from "../../types/magnet";
import { TokenInfo } from "../../types/token";
import { TokenLabel } from "../TokenLabel";

type Props = {
  recipient: string,
  magnets: RecurringMagnetDefinition[],
}

type DataRow = RecurringMagnetDefinition & {
  key: string,
}

export const RecurringMagnetTable: React.FC<Props> = (props: Props) => {
  const columns: ColumnsType<DataRow> = [
    {
      title: <span style={styles.header}>Type</span>,
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => maybeGetMagnetTypeDisplayName(type) ?? type,
    },
    {
      title: <span style={styles.header}>Start</span>,
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime) => <>{startTime.local().format('MMMM Do YYYY, h:mm a')}</>,
    },
    {
      title: <span style={styles.header}>Cliff</span>,
      dataIndex: 'cliffTime',
      key: 'cliffTime',
      render: (cliffTime: Moment, record: DataRow) => {
        if (record.type == "vest") {
          return <>{moment.duration(cliffTime.diff(record.startTime)).humanize().replace("a ", "1 ")}</>;
        } else {
          return <>-</>;
        }
      }
    },
    {
      title: <span style={styles.header}>End</span>,
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: Moment, record: DataRow) => <>
        {moment.duration(endTime.diff(record.startTime)).humanize().replace("a ", "1 ")}
      </>,
    },
    {
      title: <span style={styles.header}>Amount</span>,
      dataIndex: 'lifetimeValue',
      key: 'lifetimeValue',
      render: (lifetimeValue: number) => <>{lifetimeValue.toLocaleString()}</>,
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (token: TokenInfo) => <TokenLabel token={token}/>,
    },
  ];

  const data : DataRow[] = map(props.magnets, (m, i) => ({...m, key:`review-recurring-${m.recipient}-${i}`}));

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
