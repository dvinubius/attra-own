import './shared.css';
import { Form, Input, Typography } from "antd";
const {Title} = Typography;
const ContributorsForm = () => (
  <div layout="vertical" className="general-form">
    <Title level={3} className="section-description">
      {'Setup Contribution'}
    </Title>
      <div className="contributors-form-items">
        <Form.Item
          className="form-item"
          label={`Duration`}
          name={"_duration"}
          required
        >
          <Input placeholder="Campaign duration in seconds" />
          {/* TODO Visual Input for units */}
          {/* TODO validate not to be 0 */}
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Target ($USD)`}
          name={"_targetUsd"}
          required
        >
          <Input placeholder="Target amount to be collected" />
          {/* TODO validate not to be 0 */}
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Minimum Contribution`}
          name={"_minContributionUsd"}
          required
        >
          <Input placeholder="Minimum contribution amount" />
          {/* TODO validate to be 0 < x < 0.5*Target    */}
          {/* Display expected max number of contributors */}
          {/* Display lowest possible chance of winning for 1 contributor */}

        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Creator Fee (%)`}
          name={"_creatorFee"}
          required
        >
          <Input placeholder="Your share of the net collected funds" />
          {/* TODO input 2decimal precision percentages, process as basis points    */}
          {/* SLIDER? */}
          {/* TODO validate to be x < 50% */}
        </Form.Item>
      </div>
    </div>
);

export default ContributorsForm;