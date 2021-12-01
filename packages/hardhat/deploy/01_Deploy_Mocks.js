module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const DECIMALS = "8"; // as it is in the testnet and mainnet contracts
  const INITIAL_PRICE = "20000000000";
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  // Only if we are on a local development network, we need to deploy mocks
  if (chainId != 31337) {
    return;
  }

  log("Local network detected! Deploying mocks...");
  const linkToken = await deploy("LinkToken", { from: deployer, log: true });
  await deploy("EthUsdAggregator", {
    contract: "MockV3Aggregator",
    from: deployer,
    log: true,
    args: [DECIMALS, INITIAL_PRICE],
  });
  await deploy("VRFCoordinatorMock", {
    from: deployer,
    log: true,
    args: [linkToken.address],
  });
  await deploy("MockOracle", {
    from: deployer,
    log: true,
    args: [linkToken.address],
  });
  log("Mocks Deployed!");
};
module.exports.tags = ["all", "mocks", "main"];
