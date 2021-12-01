import './Contribute.css';
import { useState } from "react";
import { Button, Form, Modal, message, notification } from "antd";
import { useMoralis } from 'react-moralis';
import { getDeployedContract } from 'helpers/getDeployedContract';
import { PieChartOutlined } from '@ant-design/icons';
import ContributeForm from './ContributeForm';

const contractName = "AttraFinance";

const Contribute = ({campaign, ethPrice}) => {
  const { contractAddress, abi } = getDeployedContract(contractName);
  const { Moralis } = useMoralis();
  const [visibleModal, setVisibleModal] = useState(false);
  const [responses, setResponses] = useState({});

  const functionName = 'contribute';
  const contribute = async ({ethContribution}) => {
    const params = {
      _campaignId: campaign.id,
    };
    const msgValue = Moralis.Units.ETH(ethContribution);
    
    const options = {
      contractAddress,
      functionName,
      abi,
      params,
      msgValue
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
      message.success('Transaction submitted!')
      openNotification({
        message: "Your Contribution was Submitted!",
        description: `${hash}`,
      });
      console.log("🔊 New Transaction", hash);
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [functionName]: { result: null, isLoading: false } });
      message.success('Campaign created successfully');
      openNotification({
        message: "Contribution confirmed!",
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

  return <div className="Contribute">
    <Button type="primary"
      onClick={() => setVisibleModal(true)}
      size="large"
      className="contribution-button">
        Contribute<span className="icon"><PieChartOutlined /></span>
    </Button>
    
    <Modal
      title="Contribute to Campaign"
      style={{ top: 120 }}
      visible={visibleModal}

      onCancel={handleCancel}
      width={800}
      footer={[
        
      ]}
      >
      <Form name="contribute" 
        onFinish={async (values) => {
        
            const {_amount} = values;
            contribute({ethContribution: _amount});
            handleCancel();
          }}
        >
          <ContributeForm campaign={campaign} ethPrice={ethPrice}/>
          <div className="ant-modal-footer custom-footer">
            {!responses["contribute"]?.isLoading &&
              <Button className="cancel" key="back" onClick={handleCancel}>
                Cancel
              </Button>
            }
          <Form.Item className="submit-form-item">
            <Button key="submit" type="primary" htmlType="submit">
              Contribute
            </Button>
          </Form.Item>
          </div>
        </Form>
    </Modal>
  </div>;

}

export default Contribute;