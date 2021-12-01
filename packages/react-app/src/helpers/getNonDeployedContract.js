import contracts from "contracts/hardhat_non_deployed_contracts.json";

export const getNonDeployedContract = (name) => {
  const abi = contracts[name];
  return { abi };
};
