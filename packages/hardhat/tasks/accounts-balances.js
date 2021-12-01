const { printBalance } = require("../scripts/utils");
const { task } = require("hardhat/config");

task(
  "accounts-balances",
  "Prints the list of accounts and their balances",
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    const balances = [];
    for (const acc of accounts) {
      balances.push(await hre.ethers.provider.getBalance(acc.address));
    }
    const formatBal = (balance) => hre.ethers.utils.formatEther(balance);

    const all = [];
    for (let i = 0; i < accounts.length; i++) {
      const addr = accounts[i].address;
      const bal = await hre.ethers.provider.getBalance(addr);
      all.push({
        address: addr,
        balance_ETH: formatBal(bal),
      });
    }
    console.table(all);
  }
);

task(
  "accounts-balances-rinkeby",
  "Prints the list of accounts and their balances",
  async (taskArgs, hre) => {
    const accounts = (await hre.ethers.getSigners()).slice(0, 6);
    const balances = [];
    for (const acc of accounts) {
      balances.push(await hre.ethers.provider.getBalance(acc.address));
    }
    const formatBal = (balance) => hre.ethers.utils.formatEther(balance);

    const allProms = [];
    for (let i = 0; i < accounts.length; i++) {
      const addr = accounts[i].address;
      const balProm = hre.ethers.provider.getBalance(addr);
      allProms.push(balProm);
    }
    const all = (await Promise.all(allProms)).map((bal, idx) => ({
      address: accounts[idx].address,
      balance_ETH: formatBal(bal),
    }));
    console.table(all);
  }
);

module.exports = {};
