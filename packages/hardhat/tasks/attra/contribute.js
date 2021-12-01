const { task } = require("hardhat/config");

task("contribute", "Contribute to campaign")
  .addParam("id", "Campaign id")
  .addParam("amount", "Amount to send in ETH")
  .setAction(async (taskArgs, hre) => {
    await hre.run("contribute-as", {
      id: taskArgs.id,
      amount: taskArgs.amount,
      account: (await ethers.getSigners())[0].address,
    });
  });

task("contribute-as", "Contribute to a campaign with a specific signer")
  .addParam("id", "Campaign id")
  .addParam("amount", "Amount to send in ETH")
  .addParam("account", "Account address that signs the contribution")
  .setAction(async (taskArgs, hre) => {
    const attra = await hre.run("get-main-contract");
    const ethAmount = taskArgs.amount;
    const amount = ethers.utils.parseUnits(ethAmount);
    const signerAddr = taskArgs.account;
    const signer = (await hre.ethers.getSigners()).find(
      (s) => s.address === signerAddr
    );
    console.log(
      "Contributing: ",
      ethAmount.toString(),
      " by ",
      signerAddr,
      " for campaign ",
      taskArgs.id
    );
    const tx = await attra
      .connect(signer)
      .contribute(taskArgs.id, { value: amount });
    await tx.wait();
  });

module.exports = {};
