import { ClockCircleOutlined, LikeTwoTone } from "@ant-design/icons";
import { Card, Timeline, Typography, List } from "antd";
import React from "react";
import './RoadmapPage.css';

const { Text, Title } = Typography;

const styles = {
  title: {
    fontSize: "20px",
    fontWeight: "700",
  },
  text: {
    fontSize: "16px",
  },
  timeline: {
    marginBottom: "-45px",
  },
};

const milestones = [
  {
    title: 'V0 - Proof of Concept (Rinkeby)', 
    dot: { element: <ClockCircleOutlined className="timeline-clock-icon" />, color: 'red'},
    items: [
      'Crowdfund & Lottery',
      'Multiple Campaigns',
      'Multiple Lottery Winners',
      'Participation Tokens: Minting Only',
      'Campaign Automation (Keepers)',
    ]
  },
  {
    title: 'V1 - StarkNet Mainnet Launch', 
    dot: {color: '#2047f3'},
    items: [
      "Fail-Safe for VRF / beneficiary fails",
      "Mint Charity Giver Tokens (memorable NFTs)",
      "Participation Tokens: Offer Redeeming Solutions",
      "Improved Keeper Management UX",
    ]
  },
  {
    title: 'V1.1 - DeFi incentives',
    dot: {color: '#2047f3'},
    items: [
      'Collected funds are earning yield',
      'Cross-chain optimum via Popsicle Finance',
      'Earnings are distributed to all contributors',
    ]
  },
  {
    title: 'V2 - Market Intelligence Platform',
    dot: {color: '#2047f3'},
    items: [
      'Empower users to experiment',
      'Advanced campaign incentives design',
      'Customize yield earnings distribution',
      'Complex logic - Chainlink External Adapter'
    ]
  },
  {
    title: 'V2.2 - Cross-Protocol Incentives',
    dot: {color: '#2047f3'},
    items: [
      'Priviledges for holders of key assets',
      'Priviledge = higher chances / prize shares',
      'Great partnership potential',
      'Power-User Campaign Design',
    ]
  }
];

const itemStyle = (idx) => ({
  left: `${idx}rem`,
  paddingRight: `${milestones.length}rem`
});

export default function RoadmapPage() {
  return (
    <div className="Roadmap">
      <Card className="card" title={<h1 style={styles.title}>Roadmap</h1>}>
      <Timeline>
        {milestones.map((ms,idx) => 
          <Timeline.Item
            dot={ms.dot && ms.dot.element}
            color={ms.dot && ms.dot.color}
            style={itemStyle(idx)}
            >
            <Title level={5} className="tl-item">{ms.title}</Title>
            <List size="small" 
              dataSource={ms.items}
              renderItem={it => <List.Item>{it}</List.Item>}
            >
            </List>
          </Timeline.Item>
        )}
      </Timeline>
      </Card>
    </div>
  );
}
