import { ClockCircleOutlined } from "@ant-design/icons";
import { Typography, Timeline, Steps } from "antd";
import { secCol, secColShadow } from "helpers/colors";
import { miniStatus } from "helpers/formatters";
import './StatusProgress.css';

const {Text, Title} = Typography;

const {Step} = Steps;

const StatusProgress = ({campaign}) => {
  const cs = campaign.status;

  const items = createItems(cs);
  const current = cs <= 1 ? 0 : (cs >= 5 ? 2 : 1 );
  
  return (
    <div className="StatusProgress">
      <div className="wrapper">
        <Steps progressDot current={current}>
          <Step title={items[0].title} description={items[0].description} />
          <Step title={items[1].title} description={items[1].description} />
          <Step title={items[2].title} description={items[2].description} />
        </Steps>
      </div>
    </div>
  )
}


const createItems = (cs) => {
  switch (cs) {
    case 1:
      return [
        {
          title: 'Collecting',
          description: 'Receiving contributions',
        },
        {title: 'Settling', description: ''},
        {title: 'Finished', description: ''}
    ];

    case 2:
      return [
        {title: 'Collecting', description: ''},
        {
          title: 'Preparing lottery',
          description: 'Requested random seed',
        },
        {title: 'Finished', description: ''},
    ];

    case 3: 
      return [
        {title: 'Collecting', description: ''},
        {
          title: 'Lottery Ready',
          description: 'Can be initiated',
        },
        {title: 'Finished', description: ''},
      ];  
    case 4:
      return [
        {title: 'Collecting', description: ''},
        {
          title: 'Settling',
          description: 'Winners paid out, beneficiary may advance',
        },
        {title: 'Finished', description: ''},
      ];    
    case 5:
      return [
        {title: 'Collecting', description: ''},
        {title: 'Settling', description: ''},
        {
          title: 'Finished',
          description: 'Beneficiary paid out',
        },
      ];    
    case 6:
      return [
        {title: 'Collecting', description: ''},
        {title: 'Settling', description: ''},
        {
          title: 'Finished',
          description: 'All contributors refunded',
        },
      ];    
    default:
      return [];
  }
}

export default StatusProgress;