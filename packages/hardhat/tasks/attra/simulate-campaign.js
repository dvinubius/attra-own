const { task } = require("hardhat/config");

const testSuccess = (benef) => ({
  name: "TestCampaign",
  beneficiary: benef,
  tname: "TestToken",
  tsymbol: "TTX",
  duration: "12",
  prize: "1000",
  picks: "3",
  min: "100",
  target: "900",
  creatorFee: "100",
});
const testSuccessRinkeby = (benef) => ({
  ...testSuccess(benef),
  duration: "3600",
  min: "100",
  target: "400",
});

const testFail = (benef) => ({
  name: "TestCampaign",
  beneficiary: benef,
  tname: "TestToken",
  tsymbol: "TTX",
  duration: "12",
  prize: "2500",
  picks: "2",
  min: "100",
  target: "9000",
  creatorFee: "100",
});

const testFailRinkeby = (benef) => {
  return {
    ...testSuccess(benef),
    duration: "3600",
    min: "200",
    target: "10000",
  };
};

task("simulate-campaign", "Simulates a campaign")
  .addParam("success", "1 or 0")
  .setAction(async (taskArgs, hre) => {
    return hre.run("simulate-campaign-on", {
      success: taskArgs.success,
      testnet: "no",
    });
  });

task(
  "simulate-campaign-on",
  "Simulates a campaign with config for rinkeby as specified"
)
  .addParam("success", "1 or 0")
  .addParam("testnet", "yes/no - whether to config for rinkeby")
  .setAction(async (taskArgs, hre) => {
    console.log("\n========== SIMLULATING successful campaign ============");

    const duration = 12;
    const startTime = new Date().getSeconds();
    const beneficiary = (await ethers.getSigners())[11].address; // one of the other guys

    const id = await hre.run(
      "create-campaign-with",
      taskArgs.success === "1"
        ? taskArgs.testnet === "yes"
          ? testSuccess(beneficiary)
          : testSuccessRinkeby(beneficiary)
        : taskArgs.testnet === "yes"
        ? testFail(beneficiary)
        : testFailRinkeby(beneficiary)
    );

    // CONTRIBUTE
    const signers = 5;
    for (let i = 0; i < signers * 2; i++) {
      const amount = 1;
      // two rounds
      const signer = (await ethers.getSigners())[(i % signers) + 1]; // exclude the owner / beneficiary
      hre.run("contribute-as", {
        id: id.toString(),
        amount: amount.toString(),
        account: signer.address,
      });
      await hre.run("block-timestamp");
    }

    let status = await hre.run("campaign-status", {
      id: id.toString(),
    });

    if (status == 1) {
      // target not reached
      // WAIT FOR IT TO EXPIRE, otherwise can't advance
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const ellapsed = new Date().getSeconds() - startTime;
      const left = duration - ellapsed;
      console.log("time ellapsed: ", ellapsed);
      console.log("duration: ", duration);
      console.log("time left: ", left);
      await delay(left * 1000);
    }

    // ADVANCE
    await hre.run("advance-campaign", {
      id: id.toString(),
    });

    // Go the Lottery path if target reached
    status = await hre.run("campaign-status", {
      id: id.toString(),
    });

    if (status == 2) {
      // vrf callback needed
      await hre.run("vrf-provide-rand", {
        id: id.toString(),
      });
      await hre.run("campaign-status", {
        id: id.toString(),
      });
      // use the randomness. draw winners and pay them.
      console.log("BEFORE WINNERS PAY: ");
      await hre.run("treasury-balance");
      await hre.run("advance-campaign", {
        id: id.toString(),
      });
      await hre.run("campaign-status", {
        id: id.toString(),
      });
      await hre.run("treasury-balance");

      // pay beneficiary
      await hre.run("settle-beneficiary", {
        id: id.toString(),
      });
      await hre.run("campaign-status", {
        id: id.toString(),
      });
    }
  });

module.exports = {};
