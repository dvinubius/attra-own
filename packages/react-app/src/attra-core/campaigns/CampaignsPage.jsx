import { Typography, Tabs } from "antd";
import CreateStartCampaign from "attra-core/create-start-campaign/CreateStartCampaign";
import './CampaignsPage.css';
import Campaigns from "./Campaigns";
import { useEffect, useState } from "react";
import useCampaigns from "hooks/attra/useCampaigns";
import getAttraEthPrice from "helpers/getAttraEthPrice";
import { useMoralis } from "react-moralis";
const {TabPane} = Tabs;

const { Title } = Typography;

export default function CampaignsPage() {
  const {campaigns, loading} = useCampaigns();
  const {Moralis} = useMoralis();

  // take price from our contract
  const [ethPrice, setEthPrice] = useState();
  useEffect(() => {
    let interval;
    const kickOff = async () => {
      try {
        setEthPrice(await getAttraEthPrice(Moralis));
        interval = setInterval(async () => {
          setEthPrice(await getAttraEthPrice(Moralis));
        }, 60000);
      } catch (e) {
        console.log(e);
      }
    }
    kickOff();
    return () => clearInterval(interval);
  },[Moralis]);
  
  const runningCamps = campaigns ? campaigns.filter(c => 
    c.status < 2
  ) : [];
  const settlingCamps = campaigns ? campaigns.filter(c =>
    c.status > 1 && c.status < 5
  ) : [];
  const closedCamps = campaigns ? campaigns.filter(c => 
    c.status >= 5
  ) : [];  

  return (
    <div className="CampaignsPage">
      <Title level={2}>Campaigns</Title>
      <div className="content">
        <div className="the-button">
          <CreateStartCampaign></CreateStartCampaign>
        </div>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Collecting" key="1">
            <Campaigns campaigns={runningCamps} loading={loading || !ethPrice} type='running' ethPrice={ethPrice}/>
          </TabPane>
          <TabPane tab="Settling" key="2">
            <Campaigns campaigns={settlingCamps} loading={loading || !ethPrice} type='settling'ethPrice={ethPrice}/>
          </TabPane>
          <TabPane tab="Closed" key="3">
            <Campaigns campaigns={closedCamps} loading={loading || !ethPrice} type='closed'ethPrice={ethPrice}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}