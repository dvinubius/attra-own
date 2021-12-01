task("transfer-to", "Transfers from the default signer to given recipient")
  .addParam("account", "The account's address")
  .addParam("amount", "Amount of ether formatted xxx.yyy")
  .setAction(async (taskArgs, hre) => {
    const account = hre.ethers.utils.getAddress(taskArgs.account);
    const amount = hre.ethers.utils.parseUnits(taskArgs.amount);
    const tx = await hre.ethers.provider.getSigner().sendTransaction({
      to: account,
      value: amount,
    });
    await tx.wait();

    console.log("Recipient now has : ");
    const newBal = await hre.run("balance-of", {
      account,
    });
  });

module.exports = {};
