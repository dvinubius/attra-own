task("fund-campaign-with-link", "Transfer link to given campaign")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs) => {
    const campaign = await hre.run("get-campaign", {
      id: taskArgs.id,
    });
    const campaignAddr = campaign.address;

    const linkTokenContract = await hre.run("get-link-contract");

    const value = "1000000000000000000";
    const tx = await linkTokenContract.transfer(campaignAddr, value);
    console.log("Transferred 10 LINK to campaign: " + taskArgs.id);
    tx.wait();
  });

module.exports = {};
