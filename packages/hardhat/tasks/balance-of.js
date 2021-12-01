task("balance-of", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs, hre) => {
    const account = hre.ethers.utils.getAddress(taskArgs.account);
    const balance = await hre.ethers.provider.getBalance(account);

    console.log(ethers.utils.formatEther(balance), "ETH");
    return balance;
  });

module.exports = {};
