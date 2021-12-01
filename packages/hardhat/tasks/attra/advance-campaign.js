const { task } = require("hardhat/config");

task("advance-campaign", "Advance the campaign")
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs, hre) => {
    const attra = await hre.run("get-main-contract");
    const tx = await attra.advance(taskArgs.id);
    console.log("Advanced the Campaign");
    await tx.wait();
  });

module.exports = {};
