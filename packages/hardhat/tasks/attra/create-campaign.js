const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

task("create-campaign-with", "Creates and starts an Attra campaign")
  .addParam("name", "Campaign Name")
  .addParam("duration", "Campaign duration")
  .addParam("beneficiary", "Who gets the funds")
  .addParam("prize", "Prize percentage basis points")
  .addParam("picks", "Number of lottery picks")
  .addParam("min", "Minimum contribution USD")
  .addParam("target", "Target amount USD")
  .addParam("creatorFee", "Creator fee in basis points")
  .addParam("tname", "Token Name")
  .addParam("tsymbol", "Token Symbol")
  .setAction(async (taskArgs, hre) => {
    const attraFinance = await getContract();

    const {
      name,
      duration,
      beneficiary,
      prize,
      picks,
      min,
      target,
      creatorFee,
      tname,
      tsymbol,
    } = taskArgs;

    const tx = await attraFinance.createCampaign(
      name,
      duration,
      beneficiary,
      prize,
      picks,
      min,
      target,
      creatorFee,
      tname,
      tsymbol
    );
    await tx.wait();

    const id = await hre.run("latest-campaign-id");
    const address = await attraFinance.campaignById(id);
    console.log(
      "Created and started campaign with ID / Address : ",
      id,
      " / ",
      address
    );

    if (hre.ethers.provider.network.chainId === 31337) {
      // FUND WITH LINK
      await hre.run("fund-campaign-with-link", {
        id: id.toString(),
      });
    }

    return id;
  });

task("create-campaign", "Creates and starts an Attra campaign")
  .addParam("name", "Campaign Name")
  .addParam("duration", "Campaign duration in seconds")
  .setAction(async (taskArgs, hre) => {
    return await hre.run("create-campaign-with", {
      name: "TestCampaign",
      beneficiary: (await ethers.getSigners())[0].address,
      id: taskArgs.id,
      duration: taskArgs.duration,
      prize: "2500",
      picks: "1",
      min: "100",
      creatorFee: "100",
      target: "900",
      tname: "TestToken",
      tsymbol: "TTX",
    });
  });

task("create-campaign-rinkeby", "Creates and starts an Attra campaign")
  .addParam("name", "Campaign Name")
  .addParam("duration", "Duration in seconds")
  .setAction(async (taskArgs, hre) => {
    return await hre.run("create-campaign-with", {
      name: taskArgs.name,
      beneficiary: (await ethers.getSigners())[0].address,
      id: taskArgs.id,
      duration: taskArgs.duration,
      prize: "2500",
      picks: "1",
      min: "200",
      creatorFee: "100",
      target: "600",
      tname: "TestToken",
      tsymbol: "TTX",
    });
  });

module.exports = {};
