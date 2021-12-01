const { ethers } = require("hardhat");

const deploy = async () => {
  // TOKEN FACTORY

  const TokenFactory = await ethers.getContractFactory("AttraTokenFactory");
  const deployedToken = await TokenFactory.deploy();

  const tokenFactoryAddress = deployedToken.address;

  // ATTRA FINANCE
  // GET CONSTRUCTOR ARGS
  let priceFeedAddress;
  let linkTokenAddress;
  let vrfCoordinatorAddress;

  priceFeedAddress = "0x9326BFA02ADD2366b30bacB125260Af641031331";
  linkTokenAddress = "0xa36085F69e2889c224210F603D836748e7dC0088";
  vrfCoordinatorAddress = "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9";

  const keyHash =
    "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4";
  const fee = "100000000000000000";

  // DEPLOY
  const AttraFinance = await ethers.getContractFactory("AttraFinance");
  const deployedAttraFinance = await AttraFinance.deploy(
    priceFeedAddress,
    vrfCoordinatorAddress,
    linkTokenAddress,
    keyHash,
    fee,
    tokenFactoryAddress
  );

  const attraAddress = deployedAttraFinance.address;

  console.log("DEPLOYED TokenFactory: ", tokenFactoryAddress);
  console.log("DEPLOYED Attra: ", attraAddress);
};

deploy();
