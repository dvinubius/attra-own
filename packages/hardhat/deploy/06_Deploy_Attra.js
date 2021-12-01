// Deploy AttraCampaign.sol
const { networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  // TOKEN FACTORY
  const attraTokenFactory = await deploy("AttraTokenFactory", {
    from: deployer,
    args: [],
    log: true,
  });
  const tokenFactoryAddress = attraTokenFactory.address;

  // ATTRA FINANCE
  // GET CONSTRUCTOR ARGS
  let priceFeedAddress;
  let linkTokenAddress;
  let vrfCoordinatorAddress;
  let additionalMessage = "";
  if (chainId == 31337) {
    priceFeedAddress = (await deployments.get("EthUsdAggregator")).address;
    const linkToken = await get("LinkToken");
    const VRFCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
    additionalMessage = " --linkaddress " + linkTokenAddress;
  } else {
    priceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    linkTokenAddress = networkConfig[chainId].linkToken;
    vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator;
  }

  const keyHash = networkConfig[chainId].keyHash;
  const fee = networkConfig[chainId].fee;

  // DEPLOY
  await deploy("AttraFinance", {
    from: deployer,
    args: [
      priceFeedAddress,
      vrfCoordinatorAddress,
      linkTokenAddress,
      keyHash,
      fee,
      tokenFactoryAddress,
    ],
    log: true,
  });
};
module.exports.tags = ["AttraFinance"];
