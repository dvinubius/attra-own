const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task(
  "withdraw-treasury",
  "Withdraw all the treasury balance to the first account in hardhat"
).setAction(async (taskArgs, hre) => {
  const attraFinance = await getContract();
  const bal = await hre.run("treasury-balance");
  console.log("Withdrawing all from treasury");
  const myAddress = (await ethers.getSigners())[0].address;
  await attraFinance.withdrawFromTreasury(bal, myAddress);
  await hre.run("treasury-balance");
});

module.exports = {};
