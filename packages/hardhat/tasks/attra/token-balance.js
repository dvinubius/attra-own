const { task } = require("hardhat/config");

const getAttraCampaign = async () => {
  const AttraCampaign = await deployments.get("AttraCampaign");
  return ethers.getContractAt("AttraCampaign", AttraCampaign.address);
};

task(
  "token-balance",
  "Print the token balance of given account for given campaign"
)
  .addParam("account", "Whose balance?")
  .addParam("campaignid", "Id of the campaign that the reward token refers to")
  .setAction(async (taskArgs, hre) => {
    const attraCampaign = await getAttraCampaign();
    const { account, campaignId } = taskArgs;
    const balance = await attraCampaign.tokenBalance(account, campaignId);
    console.log(balance.toString());
  });

module.exports = {};
