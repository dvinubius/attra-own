
import './ContributeEstimate.css';

import { Divider, Input, Typography, Table } from "antd";
import { useState } from 'react';
import Text from 'antd/lib/typography/Text';
import { GiftOutlined, GiftTwoTone } from '@ant-design/icons';
import { secCol } from 'helpers/colors';
const {Title} = Typography;
const ContributeEstimate = ({campaign, amount}) => {

  const estimate = campaign.estimateWin(amount);

  const ticket = <GiftOutlined size={12} style={{color: "#bfbfbf"}}/>;
  const ticketWin = <GiftTwoTone size={12} twoToneColor={secCol} />

  let dataSource;
  if (campaign.numberOfPicks === 1) {
    dataSource = [
      {
        key: '1',
        wins: <div className="tickets">{ticketWin}</div>,
        chances: estimate['1_1'].chance,
        prize: estimate['1_1'].prize,
      },
    ];
  } else if (campaign.numberOfPicks === 2) {
    dataSource = [
      {
        key: '1',
        wins: <div className="tickets">{ticketWin}{ticket}</div>,
        chances: estimate['1_2'].chance,
        prize: estimate['1_2'].prize,
      },
      {
        key: '2',
        wins: <div className="tickets">{ticketWin}{ticketWin}</div>,
        chances: estimate['2_2'].chance,
        prize: estimate['2_2'].prize,
      },
    ];
  } else {
    dataSource = [
      {
        key: '1',
        wins: <div className="tickets">{ticketWin}{ticket}{ticket}</div>,
        chances: estimate['1_3'].chance,
        prize: estimate['1_3'].prize,
      },
      {
        key: '2',
        wins: <div className="tickets">{ticketWin}{ticketWin}{ticket}</div>,
        chances: estimate['2_3'].chance,
        prize: estimate['2_3'].prize,
      },
      {
        key: '3',
        wins: <div className="tickets">{ticketWin}{ticketWin}{ticketWin}</div>,
        chances: estimate['3_3'].chance,
        prize: estimate['3_3'].prize,
      },
    ];
  }
  
  const columns = [
    {
      title: '',
      dataIndex: 'wins',
      key: 'wins',
      className: 'pseudo-col'
    },
    {
      title: 'Your prize',
      dataIndex: 'prize',
      key: 'prize',
    },
    {
      title: 'Your Chances',
      dataIndex: 'chances',
      key: 'chances',
      className: 'chances-col'
    },
  ];

  return (
    <div className="ContributeEstimate">
      <Text className="explain">If total collected $ meets the campaign target exactly</Text>
      <Text className="explain hot">expect</Text>
      <Table className="estimate-table"
        dataSource={dataSource}
        columns={columns}
        pagination={false}/>
    </div>
  )
}

export default ContributeEstimate;