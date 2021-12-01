const { task } = require("hardhat/config");

task("settle-beneficiary", "Settle for beneficiary")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs, hre) => {
    const attra = await hre.run("get-main-contract");
    const campaignAddress = await attra.campaignById(taskArgs.id);
    const campaign = await hre.ethers.getContractAt(
      "AttraCampaign",
      campaignAddress
    );
    const ben = await campaign.beneficiary();
    const signer = (await hre.ethers.getSigners()).find(
      (s) => s.address === ben
    );
    console.log("Finish campaign by beneficiary ", ben);
    const tx = await attra.connect(signer).settleBeneficiary(taskArgs.id);
    await tx.wait();
  });

module.exports = {};
