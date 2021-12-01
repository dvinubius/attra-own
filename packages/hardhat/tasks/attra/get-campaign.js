const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task("get-campaign", "Retrieves the Attra campaign with given id")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs, hre) => {
    const attraFinance = await getContract();
    const campaignAddr = await attraFinance.campaignById(taskArgs.id);
    return await ethers.getContractAt("AttraCampaign", campaignAddr);
  });

module.exports = {};
