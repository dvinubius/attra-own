import { Progress, Typography } from "antd";
import { secCol, secColSemi, secColShadow } from "helpers/colors";
import { c2 } from "helpers/formatters";
import './FundsProgress.css';
const {Title, Text} = Typography;
const FundsProgress = ({campaign, width, horizontal, totalColUsd, hasReachedTarget}) => {
  const isFailed = campaign.status === 6;
  const isSuccessful = [2,3,4,5].includes(campaign.status) ||  hasReachedTarget;
  const isRunning = !isFailed && !isSuccessful;
  const percent = (totalColUsd / campaign.targetUsd * 100).toFixed(0);

  const clockColor = `hsl(4, ${90*percent/100}%, 54%)`;


  const classes = `FundsProgress${isFailed ? ' failed' : ''}${isSuccessful ? ' successful' : ''}${horizontal ? ' horizontal' : ''}`;
  return <div className={classes} style={isFailed ? {'color': clockColor} : {}}>
    <div className="position-wrapper">
      <div className="core" style={{
        'borderBottomColor' : clockColor,
        'borderTopColor' : clockColor
        }}>
        {isRunning && <Progress
          type="dashboard"
          gapDegree={100}
          width={width}
          strokeColor={clockColor}
          percent={percent}
        />}
        {isSuccessful && <Progress
          type="dashboard"
          gapDegree={100}
          width={width}
          strokeColor={secCol}
          percent={"100"}
        />}
        {isFailed && <Progress
          type="dashboard"
          gapDegree={100}
          width={width}
          percent={percent}
          status="exception"
          strokeColor={clockColor}
        />}
      </div>
      <div className="all-stats">
        <div className="stats collected">
          <h5 className="ant-typography" style={{'color': `${clockColor}`}}>{c2.format(totalColUsd)}</h5>
        </div>
        <Text>out of</Text>
        <div className="stats">
          <Title level={5}>{c2.format(campaign.targetUsd)}</Title>
        </div>
      </div>
    </div>
  </div>
}

export default FundsProgress;