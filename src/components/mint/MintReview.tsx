import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import map from 'lodash/map';
import React from 'react';
import { InProgressMagnetDefinition, maybeGetMagnetTypeDisplayName } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';
import { TokenInfo } from '../../types/token';
import { TokenLabel } from '../TokenLabel';

type Props = {
  magnets: InProgressMagnetDefinition[]
}

type DataRow = InProgressMagnetDefinition & {
  key: string,
  index: number,
}

export const MintReview : React.FC<Props> = (props) => {
  const data : DataRow[] = map(props.magnets, (mag, i) => {
    return {
      ...mag,
      key: `magnet-${i + 1}`,
      index: i + 1,
    }
  });

  const replaceEmptyCell = (v: any) => {
    if (v == null) {
      return <span style={styles.emptyCell}>-</span>
    }
    return v
  };

  const columns : ColumnsType<DataRow> = [
    {
      title: <span style={styles.header}>#</span>,
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: <span style={styles.header}>Recipient</span>,
      dataIndex: 'recipient',
      key: 'recipient',
      render: replaceEmptyCell
    },
    {
      title: <span style={styles.header}>Type</span>,
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => maybeGetMagnetTypeDisplayName(type) ?? type,
    },
    {
      title: <span style={styles.header}>Lifetime Value</span>,
      dataIndex: 'lifetimeValue',
      key: 'lifetimeValue',
      render: (lifetimeValue: number) => {
        if (lifetimeValue === undefined) {
          return replaceEmptyCell(null);
        } else {
          return lifetimeValue.toLocaleString();
        }
      },
    },
    {
      title: <span style={styles.header}>Token</span>,
      dataIndex: 'token',
      key: 'token',
      render: (token: TokenInfo) => <TokenLabel address={token.address}/>,
    },
  ];

  return (
    <>
      <div style={styles.title}>Review</div>
      <Table style={styles.table} dataSource={data} columns={columns} pagination={false}/>
    </>
  );
}

const styles : Stylesheet = {
  title: {
    fontSize: 36,
    fontWeight: 600,
  },
  table: {
    marginTop: 24,
    marginBottom: 24,
    borderStyle: "solid solid none solid",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 6,
    overflow: "hidden",
  },
  header: {
    fontWeight: 600,
  },
  emptyCell: {
    color: "#FF0000"
  }
}
