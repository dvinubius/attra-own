const chalk = require("chalk");

module.exports = {
  printBalance: (bal) => chalk.cyan(bal),

  colAddrEOA: (address) => chalk.yellow(address),

  colAddrContract: (address) => chalk.green(address),

  colAmt: (amt) => chalk.cyan(amt),

  colTX: (txHash) => chalk.bgMagenta(txHash),

  colPath: (path) => chalk.bgBlue(path),
};
