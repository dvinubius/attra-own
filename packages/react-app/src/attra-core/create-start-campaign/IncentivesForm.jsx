import './shared.css';
import { Form, Input, Typography } from "antd";
const {Title} = Typography;
const IncentivesForm = () => (
  <div layout="vertical" className="general-form">
    <Title level={3} className="section-description">
      {'Design Incentives'}
    </Title>
      <div className="contributors-form-items">
        <Form.Item
          className="form-item"
          label={`Lottery prize (%)`}
          name={"_prize"}
          required
        >
          <Input placeholder="Lottery Prize" />
          {/* TODO Visual Input for units (SLIDER) */}
          {/* TODO validate to be 0 < x < 33% */}
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Winners`}
          name={"_numberOfPicks"}
          required
        >
          <Input placeholder="Number of winners picked" />
          {/* TODO validate to be 1, 2 or 3 */}
          {/* Radio buttons with nice visuals */}
        </Form.Item>
        {/* EXAMPLE CALCULATION with winner on minimal chances */}
        {/* EXAMPLE CALCULATION with 50%-chances-winner*/}
      </div>
    </div>
);

export default IncentivesForm;