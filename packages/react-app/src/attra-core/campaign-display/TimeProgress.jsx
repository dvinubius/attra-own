import { ClockCircleOutlined } from "@ant-design/icons";
import { Progress, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import './TimeProgress.css';

const TimeProgress = ({campaign, width, horizontal, hasReachedTarget}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => {
      setNow(new Date());
    },1000);
    return () => {
      clearInterval(i);
    }
  }, []);

  // milliseconds
  const isOver = campaign.timeLeftMs(now) < 0;

  const duration = campaign.durationMs; 
  const ellapsed = isOver ? duration : campaign.ellapsedMs(now); 
  const timeLeft = isOver ? 0 : campaign.timeLeftMs(now); 

  const timeEllapsedPercent = ellapsed / duration * 100;
  const secondsLeft = timeLeft / 1000;
  const {days, hours, minutes, seconds} = calcCountdown(secondsLeft);
  const endDate = new Date(campaign.created + duration); // milliseconds
  const isComplete = campaign.status >= 2;
  


  const saturation = timeEllapsedPercent === 100 && !hasReachedTarget ? '0' : (90*timeEllapsedPercent/100).toFixed(0);
  const clockColor = `hsl(4, ${saturation}%, 54%)`;


  const classes = `TimeProgress${isComplete ? ' complete' : ''}${horizontal ? ' horizontal' : ''}`;
  return <div className={classes}>
    <div className="position-wrapper">
      <div className="core" style={{
        'borderBottomColor' : clockColor,
        'borderTopColor' : clockColor
        }}> 
        <Progress
          type="dashboard"
          width={width}
          strokeColor={
            clockColor
          }
          gapDegree={100}
          percent={timeEllapsedPercent}
        />
        <div className="time-left">
          <ClockCircleOutlined 
          color={clockColor} 
          style={{'fontSize': '2rem'}}/>
        </div>
      </div>
      {/* <Title level={5}>Time left</Title> */}
      <div className="countdown">
        <div className="numbers">
          <Space align="center" size="small">
              {days !== '00' && <>
                <span style={{'color': `${clockColor}`}}>{days}</span>
                <span>:</span>
              </>}
              {hours !== '00' && <>
                <span style={{'color': `${clockColor}`}}>{hours}</span>
                <span>:</span>
              </>}
              <span style={{'color': `${clockColor}`}}>{minutes}</span>
              <span>:</span>
              <span style={{'color': `${clockColor}`}}>{seconds}</span>
          </Space>
        </div>
        <div className="legend">
          <Space align="center" size="small">
              {days !== '00' && <>
                <span>{"DD "}</span>
                <span>{":"}</span>
              </>}
              {hours !== '00' && <>
                <span>{"HH "}</span>
                <span>{":"}</span>
              </>}
              <span>{"MM"}</span>
              <span>{":"}</span>
              <span>{"SS"}</span>
          </Space>
          <div className="until-part">until</div>
          <div className="ends-part">
            {`${endDate.toDateString()}`}
          </div> 
        </div>
      </div>
    </div>
  </div>
}

const calcCountdown = (secondsTotal) => {
  const daysLeftRaw = secondsTotal / (3600 * 24);
  const daysLeft = Math.floor(daysLeftRaw);
  const daysRem = (daysLeftRaw - daysLeft);

  const dayPart = daysRem * 3600 * 24;

  const hoursLeftRaw = dayPart / 3600;
  const hoursLeft = Math.floor(hoursLeftRaw);
  const hoursRem = hoursLeftRaw - hoursLeft;

  const hoursPart = hoursRem * 3600;

  const minutesLeftRaw = hoursPart / 60;
  const minutesLeft = Math.floor(minutesLeftRaw);
  const minutesRem = minutesLeftRaw - minutesLeft;
  
  const secondsLeft = Math.floor(minutesRem * 60);

  const daysF = `${daysLeft < 10 ? '0' : ''}${daysLeft}`; 
  const hoursF = `${hoursLeft < 10 ? '0' : ''}${hoursLeft}`; 
  const minutesF = `${minutesLeft < 10 ? '0' : ''}${minutesLeft}`; 
  const secondsF = `${secondsLeft < 10 ? '0' : ''}${secondsLeft}`; 

  return {days: daysF, hours: hoursF, minutes: minutesF, seconds: secondsF}
}

export default TimeProgress;