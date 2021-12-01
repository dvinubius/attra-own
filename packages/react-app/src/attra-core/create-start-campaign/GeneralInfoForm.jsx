import './shared.css';
import { Form, Input, Typography } from "antd";
const {Title} = Typography;
const GeneralInfoForm = () => (
  <div layout="vertical" className="general-form">
    <Title level={3} className="section-description">
      General Information
    </Title>
      <div className="general-form-items">
        <Form.Item
          className="form-item"
          label={`Campaign Name`}
          name={"_name"}
          required
        >
          <Input placeholder="Name of your campaign" />
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Beneficiary`}
          name={"_beneficiary"}
          required
        >
          <Input placeholder="Adress to receive collected funds" />
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Token Name`}
          name={"_tokenName"}
          required
        >
          <Input placeholder="Name of the participation token" />
        </Form.Item>
        <Form.Item
          className="form-item"
          label={`Token Symbol`}
          name={"_tokenSymbol"}
          required
        >
          <Input placeholder="Symbol of the participation token" />
        </Form.Item>
      </div>
    </div>
);

export default GeneralInfoForm;