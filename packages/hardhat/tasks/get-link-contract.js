const { networkConfig } = require("../helper-hardhat-config");

task(
  "get-link-contract",
  "Get LINK contract on current network / chain"
).setAction(async (taskArgs) => {
  const { get } = hre.deployments;

  // Get signer information
  const accounts = await hre.ethers.getSigners();
  const signer = accounts[0];

  // get address on current newtork
  const chainId = await getChainId();
  let linkTokenAddress;
  if (chainId == 31337) {
    linkTokenAddress = (await get("LinkToken")).address;
  } else {
    linkTokenAddress = networkConfig[chainId].linkToken;
  }
  console.log("Link contract is at ", linkTokenAddress);

  const LinkToken = await ethers.getContractFactory("LinkToken");
  return new ethers.Contract(linkTokenAddress, LinkToken.interface, signer);
});

module.exports = {};
