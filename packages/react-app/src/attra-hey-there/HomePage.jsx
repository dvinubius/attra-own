import { Card, Typography, List, Divider } from "antd";
import React from "react";
import './HomePage.css';

const { Title, Paragraph, Text } = Typography;

// Multi-purpose
const itemsCrowdfunding1 = [
  'Investment or Charity',
  'Open access to create campaigns',
  'Transparent fund management on-chain',
  'Flexible Campaign Design (Incentives)'
];

// participation
const itemsCrowdfunding2 = [
  'Open access to participate',
  'Participants receive redeemable tokens',
  'Charity givers receive themed NFTs',
  'StarkNet for broader access (costs)'
];

const itemsIncentives1 = [
  // lottery
  'Lottery after a successful campaign',
  'Chances according to contributions',
  'Multiple winners possible',
  'Prize: contribution refund + % of collected funds',
];
const itemsIncentives2 = [
  // defi earnings
  'Funds earn yield while they are being collected',
  'Using established cross-chain DeFi protocols',
  'Customize distribution of earnings at the end'
];
const itemsIncentives3 = [
  // cross-protocol leverage
  'Favor participants that hold specific assets',
  'Favored get greater chances to win the lottery',
  'Favored get a greater share of DeFi earnings'
];

const itemsChainlink = [
  'We are Ethereum compatible, and currently deployed on the Rinkeby Testnet',
  'Our eventual target is Layer2 (StarkNet), so we can offer a fast experience with extremely low costs',
  'Automated campaign management is provided by Chainlink Keepers',
  'Provably fair randomness is provided by Chainlink VRF',
  'Secure complex lottery procedures are possible with Chainlink External Adapters'
];


export default function HomePage() {
  return (
    <div className="Home">
      <div className="banner">
        <Title className="main-title">
          <span className="logo-text">.attra</span>
        </Title>
        <div className="taglines">
          <Paragraph className="tagline-big">
            you attract the money
          </Paragraph>
        </div>
      </div>
    <div className="Home-inner">
      <Card className="explain-card">
        <div className="explain">
          <Text>
            .attra unlocks incentive-boosted crowdfunding.
          </Text>
          <Text>
            Many contribute, some get very lucky.
          </Text>
          <Text>
            <span className="attra-burn">You</span> design who can win what.
          </Text>
          <Text>You attract the money.</Text>
        </div>
      </Card>
      <div className="feature-card-wrapper">
        <Card className="feature-card" title={<h1 className="cardTitle">Crowdfunding Campaigns</h1>} >
          <div className="lists-row">
            <div className="list-col">
              <Divider orientation="left">Suitable for Many Use Cases</Divider>
              <List
                size="large"
                bordered
                dataSource={itemsCrowdfunding1}
                renderItem={item => <List.Item>{item}</List.Item>}
              />        
            </div>
            <div className="list-col">
              <Divider orientation="left">Easy Participation</Divider>
              <List
                size="large"
                bordered
                dataSource={itemsCrowdfunding2}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </div>
          </div>
        </Card>
      </div>
      <Card className="explain-card">
        <div className="explain">
          <Text>
            The best marketing / PR can only get you so far.
          </Text>
          <Text>
            Smart incentive design gives your campaign the edge.
          </Text>
        </div>
      </Card>
      <div className="feature-card-wrapper">
        <Card className="feature-card" title={<h1 className="cardTitle">Incentives</h1>}>
          <div className="lists-row">
            <div className="list-col">
              <Divider orientation="left">Lottery</Divider>
              <List
                size="large"
                bordered
                dataSource={itemsIncentives1}
                renderItem={item => <List.Item>{item}</List.Item>}
              /> 
            </div>
            <div className="list-col">
              <Divider orientation="left">DeFi Yield</Divider>
              <List
                size="large"
                bordered
                dataSource={itemsIncentives2}
                renderItem={item => <List.Item>{item}</List.Item>}
              /> 
            </div>
            <div className="list-col">
              <Divider orientation="left">Cross-protocol incentives</Divider>
              <List
                size="large"
                bordered
                dataSource={itemsIncentives3}
                renderItem={item => <List.Item>{item}</List.Item>}
              /> 
            </div>
          </div>
        </Card>
      </div>
      <Card className="explain-card">
        <div className="explain">
          <Text>
            Blockchain is at the core of our services.
          </Text>
          <Text>
            We leverage the best of both on-chain and off-chain technology.
          </Text>
        </div>
      </Card>
      <div className="feature-card-wrapper">
        <Card className="feature-card" title={<h1 className="cardTitle">Technology Stack: Ethereum, Moralis, Chainlink</h1>}>
          <List
            size="large"
            bordered
            dataSource={itemsChainlink}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Card>
      </div>
    </div>
  </div>    
  );
}
