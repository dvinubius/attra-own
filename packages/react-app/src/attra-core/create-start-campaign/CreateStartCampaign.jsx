import './CreateStartCampaign.css';
import { useState } from "react";
import { Button, Form, Modal, Steps, message, Input, Divider, notification } from "antd";
import { useMoralis } from 'react-moralis';
import GeneralInfoForm from './GeneralInfoForm.jsx';
import ContributionsForm from './ContibutorsForm.jsx';
import IncentivesForm from './IncentivesForm';
import { getDeployedContract } from 'helpers/getDeployedContract';
const { Step } = Steps;

const contractName = "AttraFinance";

const CreateStartCampaign = () => {
  const { contractAddress, abi } = getDeployedContract(contractName);
  const { Moralis } = useMoralis();
  const [visibleModal, setVisibleModal] = useState(false);
  const [responses, setResponses] = useState({});

  const functionName = 'createCampaign';
  const createStartCampaign = async ({_name, _duration, _numberOfPicks}) => {
    const params = {
      _name,
      _duration,
      _beneficiary:  "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
      _prize: "1000",
      _numberOfPicks,
      _minContributionUsd: "100",
      _creatorFee: "100",
      _targetUsd: "800",
      _tokenName: "TestToken",
      _tokenSymbol: "TTX",
    };

    const options = {
      contractAddress,
      functionName,
      abi,
      params
    };

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
    
    const tx = await Moralis.executeFunction({ awaitReceipt: false, ...options });
    tx.on("transactionHash", (hash) => {
      setResponses({ ...responses, [functionName]: { result: null, isLoading: true } });
      // message.success('Transaction submitted!')
      openNotification({
        message: "🔊 Submitted!",
        description: `${hash}`,
      });
      setVisibleModal(false);
      console.log("🔊 New Transaction", hash);
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [functionName]: { result: null, isLoading: false } });
      // message.success('Campaign created successfully');
      openNotification({
        message: "📃 Your Campaign has been created",
        description: `${receipt.transactionHash}`,
      });
      console.log("🔊 New Receipt: ", receipt);
    }).on("error", (error) => {
      console.log(error);
    });
  }

  const handleCancel = () => {
    setVisibleModal(false);
  };

  return <>
    <Button
        type="primary"
        onClick={() => setVisibleModal(true)}
      >
        New Campaign
    </Button>

    <Modal
      title="Create a New Campaign"
      style={{ top: 120 }}
      visible={visibleModal}
      // onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      footer={[]}
      className="CreateStartCampaignModal"
      >
      <Form name="basic"
        onFinish={async (values) => {
            debugger;
            

            const {_name, _duration, _numberOfPicks} = values;

            await createStartCampaign({_name, _duration, _numberOfPicks});
          }}
        >
          <Divider orientation="left">General Information</Divider>
          <div className="form-items">
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
          <Divider orientation="left">Contributions</Divider>
          <div className="form-items">
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
          <Divider orientation="left">Incentives</Divider>
          <div className="form-items">
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

        <div className="ant-modal-footer my-custom">
          <>
          {!responses["createStartCampaign"]?.isLoading &&
            <Button className="cancel" key="back" onClick={handleCancel}>
              Cancel
            </Button>
          }
          <Form.Item className="submit-form-item">
            <Button key="submit" 
              type="primary"
              htmlType="submit"
              loading={responses["createStartCampaign"]?.isLoading}>
              Create
            </Button>
          </Form.Item>
          
          </>
        </div>
      </Form>
    </Modal>
  </>;

}

export default CreateStartCampaign;