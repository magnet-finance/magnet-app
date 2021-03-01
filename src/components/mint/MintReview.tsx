import { Table } from 'antd';
import map from 'lodash/map';
import React from 'react';
import { getTokenDisplayString } from '../../logic/tokenType';
import { InProgressMagnetDefinition } from '../../types/magnet';
import { Stylesheet } from '../../types/stylesheet';

type Props = {
  magnets: InProgressMagnetDefinition[]
}


export const MintReview : React.FC<Props> = (props) => {

  const data = map(props.magnets, (mag, i) => {
    return {
      key: `magnet-${i + 1}`,
      index: i + 1,
      recipient: mag.recipient,
      type: {
        vest: "Vesting",
        stream: "Streaming",
        gift: "Bonus"
      }[mag.type],
      lifetimeValue: ((mag) => {
        if (mag.type === "gift") return mag.giftValue;
        return mag.lifetimeValue;
      })(mag),
      tokenType: getTokenDisplayString(mag.tokenType)
    }
  });

  const replaceEmptyCell = (v: any) => {
    if (v == null) {
      return <span style={styles.emptyCell}>-</span>
    }
    return v
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      key: 'recipient',
      render: replaceEmptyCell
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Lifetime Value',
      dataIndex: 'lifetimeValue',
      key: 'lifetimeValue',
      render: replaceEmptyCell
    },
    {
      title: 'Token',
      dataIndex: 'tokenType',
      key: 'tokenType',
      render: replaceEmptyCell
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
  emptyCell: {
    color: "#FF0000"
  }
}
