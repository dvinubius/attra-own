const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task("campaign-link-balance", "Get LINK balance of given campaign")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs) => {
    const attraFinance = await getContract();
    const campaignAddr = await attraFinance.campaignById(taskArgs.id);

    const linkTokenContract = await hre.run("get-link-contract");

    const balanceHex = await linkTokenContract.balanceOf(campaignAddr);
    const balance = await ethers.BigNumber.from(balanceHex._hex).toString();
    console.log(
      "LINK balance of campaign: " + taskArgs.id + " is " + balance / 10 ** 18
    );
  });

module.exports = {};
