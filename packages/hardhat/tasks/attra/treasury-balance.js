const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task("treasury-balance", "Print and return the treasury balance").setAction(
  async (taskArgs, hre) => {
    const attraFinance = await getContract();
    const treasuryAddress = await attraFinance.treasuryAddress();
    const balance = await hre.ethers.provider.getBalance(treasuryAddress);
    console.log("Treasury balance: ", balance.toString());
    return balance;
  }
);

module.exports = {};
