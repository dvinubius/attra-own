
import './ContributeForm.css';

import { Divider, Form, Input, Typography } from "antd";
import { useState } from 'react';
import ContributeEstimate from './ContributeEstimate';
import { c2} from 'helpers/formatters';

const {Title} = Typography;

const ContributeForm = ({campaign, ethPrice}) => {
  const [amt, setAmt] = useState();
  const [amtUsd, setAmtUsd] = useState();

  const minEth = `${(+campaign.minContributionUsd / ethPrice).toFixed(2)} ETH`;

  const handleInput = (ev) => {
    const eth = ev.target.value;
    setAmt(eth);
    setAmtUsd(eth * ethPrice);
  }

  return (
    <div className="ContributeForm">
      <div className="input-section">
        <Form.Item
            className="form-item"
            label={`Amount ETH`}
            name={"_amount"}
            required
          >
            <Input placeholder="Enter Amount" onInput={handleInput}/>
        </Form.Item>
        <Title level={5}>{`Minimum: ${c2.format(campaign.minContributionUsd)} = ${minEth}`}</Title>
      </div>
      <Divider>Your Winning Chances</Divider>
      <ContributeEstimate campaign={campaign} amount={amtUsd}></ContributeEstimate>
    </div>
  )
}

export default ContributeForm;