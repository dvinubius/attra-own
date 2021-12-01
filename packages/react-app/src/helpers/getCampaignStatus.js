import { getNonDeployedContract } from "./getNonDeployedContract";

const contractName = "AttraCampaign";
const network = "hardhat";

export const getCampaignStatus = async (campaignAddress) => {
  const { abi } = getNonDeployedContract(contractName);
  const options = {
    chain: network,
    address: campaignAddress,
    function_name: "status",
    abi: abi,
    params: {},
  };
  // eslint-disable-next-line no-undef
  const state = await Moralis.Web3API.native.runContractFunction();
  return state;
};
