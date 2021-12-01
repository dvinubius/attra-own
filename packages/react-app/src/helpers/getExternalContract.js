import * as externalContracts from "contracts/external_contracts";

export const getExternalContract = (symbol) => {
  const ctrct = externalContracts[4][symbol];
  return { abi: ctrct.abi, contractAddress: ctrct.address };
};
