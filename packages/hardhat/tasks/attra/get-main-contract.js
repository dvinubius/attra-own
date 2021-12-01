const { task } = require("hardhat/config");

task(
  "get-main-contract",
  "Retrieves the main contract from deployments"
).setAction(async (taskArgs, hre) => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
});

module.exports = {};
