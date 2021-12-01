const { task } = require("hardhat/config");

const getContract = async () => {
  const AttraFinance = await deployments.get("AttraFinance");
  return ethers.getContractAt("AttraFinance", AttraFinance.address);
};

const getVRFCoordinator = async () => {
  const VRFContract = await deployments.get("VRFCoordinatorMock");
  return ethers.getContractAt("VRFCoordinatorMock", VRFContract.address);
};

task(
  "vrf-provide-rand",
  "Make the VRFCoordinator execute the callback with requested randomness"
)
  .addParam("id", "Campaign id")
  .setAction(async (taskArgs, hre) => {
    const attraFinance = await getContract();
    const campaignAddr = await attraFinance.campaignById(taskArgs.id);
    const attraCampaign = await ethers.getContractAt(
      "AttraCampaign",
      campaignAddr
    );
    const vrfCoordinator = await getVRFCoordinator();

    const requestId = await attraCampaign.reqId();
    const tx = await vrfCoordinator.callBackWithRandomness(
      requestId,
      hre.ethers.BigNumber.from("12345678765432123456543213456789876544321123"),
      attraCampaign.address
    );

    console.log(
      "VRFContract called callback on lottery fund with requested randomness"
    );
    await tx.wait();
  });

module.exports = {};
