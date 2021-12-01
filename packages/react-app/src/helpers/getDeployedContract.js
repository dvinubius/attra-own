import contracts from "contracts/hardhat_contracts.json";
import { isLocal } from "../contracts/deployment_cfg";

export const getDeployedContract = (name) => {
  const ctrct = isLocal
    ? contracts["31337"]["localhost"]["contracts"][name]
    : contracts["4"]["rinkeby"]["contracts"][name];
  return { abi: ctrct.abi, contractAddress: ctrct.address };
};
