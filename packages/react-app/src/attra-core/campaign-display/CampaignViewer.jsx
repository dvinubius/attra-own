import './CampaignViewer.css';
import { Button, Card, Typography, Space, Divider, Descriptions } from "antd";
import { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useEffect } from "react";
import Address from "components/Address/Address";
import { c2, tokenValue, tokenValueTxt } from "helpers/formatters";
import FundsProgress from './FundsProgress';
import TimeProgress from './TimeProgress';
import {  DoubleRightOutlined, } from '@ant-design/icons';
import StatusProgress from './StatusProgress';
import Contribute from './Contribute';
import useTargetReached from 'hooks/attra/useTargetReached';
import Advance from './Advance';
import AddLink from './AddLink';


const { Text, Title } = Typography;

const CampaignViewer = ({campaign, ethPrice, text}) => {
  const {targetReached, totalCollectedUsd } = useTargetReached();
  const hasReachedTarget = campaign && targetReached(campaign, ethPrice);
  const totalColUsd = campaign && totalCollectedUsd(campaign, ethPrice);
  
  const vrfFee = '100000000000000000';
  const {Moralis} = useMoralis();
  const [linkBalance, setLinkBalance] = useState();
  
  const getLinkBal = async () => {
    const bal = await Moralis.Cloud.run("linkBalance", {address: campaign.address});
    setLinkBalance(bal.toString());
  }
  useState(() => {
    getLinkBal();
  }, [getLinkBal]);

  const web3 = new Moralis.Web3();
  const isLotteryNextStep = campaign.status === 1 && hasReachedTarget;
  const needsMoreLink = isLotteryNextStep && linkBalance ? web3.utils.toBN(linkBalance).lt(web3.utils.toBN(vrfFee)) : false;
  const linkBalanceDisplay = linkBalance ? tokenValue(linkBalance, 18).toFixed(2) : '';
  const vrfFeeReadable = linkBalance ? tokenValue(vrfFee, 18).toFixed(2) : '';
  const isWaitingForRandomness = campaign && campaign.status === 2;
  
  const isSettling = campaign && [2,3,4].includes(campaign.status);
  const isClosed = campaign && campaign.status >= 5;
  const showAutomated = campaign && campaign.status < 4;


  const handleAutomate = () => {
    window.open('https://keepers.chain.link/', "_blank");
  }
  return <div className="CampaignViewer">
    <Card className="viewer-card"
      size="large"
      title={ <>
        <Title level={5}>{campaign.name}</Title>
        <div className="address">
          <Address avatar linked copyable size="4" address={campaign.address}/>
        </div>
        </>
      }>
      
          <div className="stats-section" style={isSettling ? {'justifyContent' : 'center'} : {}}>
            
            <FundsProgress campaign={campaign} width={80} horizontal totalColUsd={totalColUsd} hasReachedTarget={hasReachedTarget}/>
            
            {!isSettling && 
              <TimeProgress campaign={campaign} width={80} horizontal hasReachedTarget={hasReachedTarget}/>
            }
          </div>

          {!isSettling && !hasReachedTarget && !campaign.hasExpired() &&
          <div className="actions-section">
            <div className="contribution-col">
              <Contribute campaign={campaign} ethPrice={ethPrice}/>
              <Space align="center">
                <Text className="left">Minimum </Text>
                <Title level={5}>{c2.format(campaign.minContributionUsd)}</Title>
              </Space>
              <Space align="center">
                <Text className="left">Prize</Text>
                <Title level={5}>{`${campaign.prize / 100}%`}</Title>
              </Space>
              <Space align="center">
                <Text className="left">Winner Picks </Text>
                <Title level={5}>{campaign.numberOfPicks}</Title>
              </Space>
            </div>
          </div>}

          <Divider orientation="left">Manage</Divider>
          <div className="manage-section">
            <div className="manage-col">
              {!isClosed && <div className="actions-row advance">
                <Advance campaign={campaign} isDisabled={needsMoreLink || isWaitingForRandomness}></Advance>
              </div>}
              <StatusProgress campaign={campaign}></StatusProgress>
              {linkBalance && needsMoreLink && <div className="actions-row">
                <div className="info">
                  <Text className="left">LINK Balance</Text>
                  <Text className="right mono">{linkBalanceDisplay}</Text>
                  {needsMoreLink && <Text className='warning'>{`(need ${vrfFeeReadable} to perform lottery)`}</Text>}
                </div>
                {needsMoreLink && <AddLink campaign={campaign} refreshBalance={getLinkBal}/>}
              </div>}
              {showAutomated && <div className="actions-row">
                <div className="info">
                  <Text className="left">Automated</Text>
                  <Text className="right">{campaign.isAutomated ? 'YES' : 'NO'}</Text>
                </div>
                {!campaign.isAutomated && <Button type="secondary" onClick={handleAutomate}>Automate</Button>}
              </div>}
            </div>
          </div>


          <Divider orientation="left">About</Divider>
          <div className="info-section">
            <div className="campaign-info">
                <div className="info-row">
                  <Text className="left">Created</Text>
                  <Text className="mono">{campaign.created.toLocaleString()}</Text>
                </div>
                <div className="info-row">
                  <Text className="left">Creator Fee</Text>
                  <Text className="mono">{`${campaign.creatorFee / 100}%`}</Text>
                </div>
                <div className="info-row">
                  <Text className="left">Token Name</Text>
                  <Text className="mono">{campaign.tokenName}</Text>
                </div>
                <div className="info-row">
                  <Text className="left">Token Symbol</Text>
                  <Text className="mono">{`${campaign.tokenSymbol}`}</Text>
                </div>
            </div>  
            <div className="campaign-info right">
                <div className="info-row">
                  <Text className="left">Creator</Text>
                  <Address avatar copyable size={6} address={campaign.creator}></Address>
                </div>
                <div className="info-row">
                  <Text className="left">Beneficiary</Text>
                  <Address avatar copyable size={6} address={campaign.beneficiary}></Address>
                </div>
            </div>          
          </div>
    </Card>
    
  </div>
};

export default CampaignViewer;