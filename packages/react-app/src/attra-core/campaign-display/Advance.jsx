import './Advance.css';
import { useState } from "react";
import { Button, message, notification } from "antd";
import { useMoralis } from 'react-moralis';
import { getDeployedContract } from 'helpers/getDeployedContract';
import { DoubleRightOutlined } from '@ant-design/icons';

const contractName = "AttraFinance";

const Advance = ({campaign, confirmSubmit, confirmMined, isDisabled}) => {
  const { contractAddress, abi } = getDeployedContract(contractName);
  const { Moralis } = useMoralis();
  const [responses, setResponses] = useState({});

  

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {},
    });
  };

  const advanceFnName = 'advance';
  const advance = async () => {
    const advanceParams = {
      _campaignId: campaign.id
    };
    const advanceOptions = {
      contractAddress,
      functionName: advanceFnName,
      abi,
      params: advanceParams,
    };
    
    const tx = await Moralis.executeFunction({ awaitReceipt: false, ...advanceOptions });
    tx.on("transactionHash", (hash) => {
      setResponses({ ...responses, [advanceFnName]: { result: null, isLoading: true } });
      message.success('Transaction submitted!')
      openNotification({
        message: "Transaction submitted. Please wait for confirmation.",
        description: `${hash}`,
      });
      console.log("🔊 New Transaction", hash);
      // confirmSubmit();
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [advanceFnName]: { result: null, isLoading: false } });
      message.success('Advanced the campaign!');
      openNotification({
        message: "📃 Transaction mined.",
        description: `${receipt.transactionHash}`,
      });
      // confirmMined();
      console.log("🔊 New Receipt: ", receipt);
    }).on("error", (error) => {
      console.log(error);
    });
  }

  const settleBenFnName = 'settleBeneficiary';
  const settleBen = async () => {
    const settleBenParams = {
      _campaignId: campaign.id
    };
    const advanceOptions = {
      contractAddress,
      functionName: settleBenFnName,
      abi,
      params: settleBenParams,
    };
    
    const tx = await Moralis.executeFunction({ awaitReceipt: false, ...advanceOptions });
    tx.on("transactionHash", (hash) => {
      setResponses({ ...responses, [advanceFnName]: { result: null, isLoading: true } });
      message.success('Transaction submitted!')
      openNotification({
        message: "Transaction submitted. Please wait for confirmation.",
        description: `${hash}`,
      });
      console.log("🔊 New Transaction", hash);
      // confirmSubmit();
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [advanceFnName]: { result: null, isLoading: false } });
      message.success('Beneficiary was paid out!');
      openNotification({
        message: "📃 Transaction mined.",
        description: `${receipt.transactionHash}`,
      });
      // confirmMined();
      console.log("🔊 New Receipt: ", receipt);
    }).on("error", (error) => {
      console.log(error);
    });
  }



  
  const handleAdvance = async () => {
    [1,2,3].includes(campaign.status) ? advance() : settleBen();
  };

  const btnText = campaign && (
    [1,2,3].includes(campaign.status)
      ? 'Advance'
      : (campaign.status === 4 ? 'Pay Beneficiary' : '')
  );

  return campaign && <div className="Advance">
    <Button type="primary"
      onClick={() => handleAdvance(true)}
      size="large"
      className="contribution-button"
      disabled={isDisabled}>
      {btnText}
    <DoubleRightOutlined /></Button>
  
  </div>;

}

export default Advance;