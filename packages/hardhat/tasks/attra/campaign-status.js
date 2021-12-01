const { task } = require("hardhat/config");

task("campaign-status", "State of the campaign")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs, hre) => {
    const attra = await hre.run("get-main-contract");
    const campaignAddress = await attra.campaignById(taskArgs.id);
    const campaign = await hre.ethers.getContractAt(
      "AttraCampaign",
      campaignAddress
    );

    const state = await campaign.status();
    let printable;
    switch (state) {
      case 0:
        printable = "Not started yet";
        break;
      case 1:
        printable = "Running";
        break;
      case 2:
        printable = "Target reached, VRF requested";
        break;
      case 3:
        printable = "Target reached, ready for lottery";
        break;
      case 4:
        printable = "Target reached, lottery finished, paid out winner & owner";
        break;
      case 5:
        printable = "Target reached, all settled";
        break;
      case 6:
        printable = "Target NOT reached, closed";
        break;
    }

    console.log("Campaign status: ", printable);
    return state;
  });

module.exports = {};
