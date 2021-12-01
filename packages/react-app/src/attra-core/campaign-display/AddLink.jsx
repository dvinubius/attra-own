import './AddLink.css';
import { useCallback, useEffect, useState } from "react";
import { Button, Form, Modal, Steps, message, notification } from "antd";
import { useMoralis } from 'react-moralis';
import { getDeployedContract } from 'helpers/getDeployedContract';
import { getExternalContract } from 'helpers/getExternalContract';

const contractName = "AttraFinance";

const AddLink = ({campaign, refreshBalance}) => {
  const { contractAddress: attraAddress, abi } = getDeployedContract(contractName);
  const {contractAddress: linkAddress, abi: linkAbi} = getExternalContract("LINK");
  const { Moralis } = useMoralis();
  const [visibleModal, setVisibleModal] = useState(false);
  const [responses, setResponses] = useState({});
  // const [approvedLink, setApprovedLink] = useState(false);

  const address = campaign.address


  // const isApprovedCheck = useCallback(async () => {
  //   const hasEnoughAllowance = await Moralis.Cloud.run("isApproved", {address});
  //   setApprovedLink(hasEnoughAllowance);
  // }, [Moralis, address]);
  

  // useEffect(() => {
  //   isApprovedCheck();
  // }, [isApprovedCheck]);


  // useEffect to query whether LINK allowance


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

  const approveFunctionName = 'approve';
  const approveLink = async () => {
    const paramsApprove = {
      _spender: attraAddress,
      _value: "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff" // TODO create attra function for this
    };
    const optionsApprove = {
      contractAddress: linkAddress,
      functionName: approveFunctionName,
      abi: linkAbi,
      params: paramsApprove,
    };
    
    const txApprove = await Moralis.executeFunction({ awaitReceipt: false, ...optionsApprove });
    txApprove.on("transactionHash", (hash) => {
      setResponses({ ...responses, [approveFunctionName]: { result: null, isLoading: true } });
      
      openNotification({
        message: "Sent Approval Transaction!",
        description: `${hash}`,
      });
      console.log("🔊 New Transaction", hash);
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [approveFunctionName]: { result: null, isLoading: false } });
      
      openNotification({
        message: "Approval Tranaction mined!",
        description: `${receipt.transactionHash}`,
      });
      // setApprovedLink(true);
      console.log("🔊 New Receipt: ", receipt);
    }).on("error", (error) => {
      console.log(error);
    });
  }

  const fundFunctionName = 'fundCampaignWithLink';
  const fundLink = async () => {
    const params = {
      _campaignId: campaign.id
    };
    const options = {
      contractAddress: attraAddress,
      functionName: fundFunctionName,
      abi,
      params,
    };
    
    const tx = await Moralis.executeFunction({ awaitReceipt: false, ...options });
    tx.on("transactionHash", (hash) => {
      setResponses({ ...responses, [fundFunctionName]: { result: null, isLoading: true } });
  
      openNotification({
        message: "Transaction sent!",
        description: `${hash}`,
      });
      setVisibleModal(false);
      console.log("🔊 New Transaction", hash);
    }).on("receipt", (receipt) => {
      setResponses({ ...responses, [fundFunctionName]: { result: null, isLoading: false } });
      
      openNotification({
        message: "Campaign was successfully funded with link",
        description: `${receipt.transactionHash}`,
      });
      refreshBalance();
      console.log("🔊 New Receipt: ", receipt);
    }).on("error", (error) => {
      console.log(error);
    });
  }

  const handleCancel = () => {
    setVisibleModal(false);
  };

  return <>
    <Button type="secondary"
      onClick={() => setVisibleModal(true)}

      className="contribution-button">
        Add Link
    </Button>
    
    <Modal
      title="Fund Campaign with Link"
      style={{ top: 120 }}
      visible={visibleModal}
      onCancel={handleCancel}
      width={500}
      className="AddLinkModal"
      >
        <div className="buttons">
          {
            <Button size="large" key="back" type="primary" onClick={approveLink} loading={responses["contribute"]?.isLoading}>
              Approve
            </Button>
          }
          <Button key="submit" size="large" type="primary" onClick={fundLink} loading={responses["contribute"]?.isLoading}>
            Add Link
          </Button>
        </div>
  
    </Modal>
  </>;

}

export default AddLink;