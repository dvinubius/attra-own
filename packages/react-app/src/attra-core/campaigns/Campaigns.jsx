import { Divider, Typography, notification, Skeleton, Button } from "antd";
import { useState } from "react";
import { useMoralis, useMoralisQuery } from "react-moralis";
import { useEffect } from "react";
import './CampaignsPage.css';
import './Campaigns.css';
import { getDeployedContract } from "helpers/getDeployedContract";
import CampaignCard from "../campaign-display/CampaignCard";
import CampaignViewer from "attra-core/campaign-display/CampaignViewer";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const contractName = "AttraFinance";
export default function Campaigns({campaigns, loading, type, ethPrice}) {
  const { Moralis } = useMoralis();
  const { contractAddress, abi } = getDeployedContract(contractName);
  const [responses, setResponses] = useState({});
  const [viewedCampaign, setViewedCampaign] = useState(null);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const handleView = (campaignDetails) => {
    setViewedCampaign(campaignDetails);
  } 
  const resetView = () => setViewedCampaign(null);

  return (
    <div className="Campaigns">
      {viewedCampaign && 
        <div className="detail-view">
          <Button className="back-button" type="secondary" onClick={resetView}>
            <ArrowLeftOutlined />
            Back
          </Button>
          <CampaignViewer campaign={viewedCampaign} ethPrice={ethPrice}></CampaignViewer>
        </div>
      }
      {!viewedCampaign && 
        <>
          <div className="campaigns">
            {loading && <>
              <Skeleton avatar paragraph={{ rows: 2 }} active/>
              <Skeleton avatar paragraph={{ rows: 2 }} active/>
              <Skeleton avatar paragraph={{ rows: 2 }} active/>
              <Skeleton avatar paragraph={{ rows: 2 }} active/>
              </>
            }
            {!loading && campaigns.length === 0 && 
              <Title level={3} className="no-cards">
                {`There are no ${type} campaigns`}
              </Title>
            }
            {!loading && campaigns.length > 0 && campaigns.map(campaign => 
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onOpen={handleView}
                ethPrice={ethPrice}/>
            )}
          </div>
        </>
      }
    </div>
  );
}
