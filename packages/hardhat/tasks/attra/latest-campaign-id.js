const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task("latest-campaign-id", "Print and return latest campaign's id").setAction(
  async (taskArgs, hre) => {
    const attraFinance = await getContract();
    const id = (await attraFinance.totalCampaigns()).toNumber() - 1;
    console.log("Latest campaign ID: ", id);
    return id;
  }
);

module.exports = {};
