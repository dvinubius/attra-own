import "./CampaignCard.css";
import { Card, Typography, Divider } from "antd";
import Address from "components/Address/Address";
import FundsProgress from "./FundsProgress";
import TimeProgress from "./TimeProgress";
import useTargetReached from "hooks/attra/useTargetReached";


const { Text, Title } = Typography;

export default function CampaignCard({campaign, onOpen, ethPrice}) {
  const {targetReached, totalCollectedUsd } = useTargetReached();

  const handleOpen = () => {
    onOpen(campaign); 
  }

  const hasReachedTarget = targetReached(campaign, ethPrice);
  const totalColUsd = totalCollectedUsd(campaign, ethPrice);

  const activeButCanClose = campaign.status === 1 && 
    (hasReachedTarget || campaign.hasExpired());
  const closingMessage = activeButCanClose ? 
    (hasReachedTarget ? 'Target achieved! This campaign can be settled' : 'Target failed! This campaign can be closed')
    : '';

  return (
    <Card className={`CampaignCard`}
      onClick={handleOpen}
      size="small"
      title={
        <div className="title-row">
          <Title level={5}>{campaign.name}</Title>
        </div>
      }
    >
      <div className="inner" style={campaign.isSettling ? {'justifyContent' : 'center'} : {}}>
        <FundsProgress campaign={campaign} width={80} horizontal totalColUsd={totalColUsd} hasReachedTarget={hasReachedTarget}/>
        {!campaign.isSettling && 
          <TimeProgress campaign={campaign} width={80} horizontal hasReachedTarget={hasReachedTarget}/>
        }
      </div>
      
      <div className="status-bar">
        {activeButCanClose && <>
            <Divider></Divider>
            <div className={`status-content${hasReachedTarget ? ' success': ' fail'}`}>
              <Text>{closingMessage}</Text>
            </div>
          </>
        }
      </div>    

    </Card>
  );
}
