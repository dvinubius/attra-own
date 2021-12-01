const fs = require("fs");
const chalk = require("chalk");
const publishDir = "../react-app/src/contracts";

function exportNonDeployed(contractName, networkName) {
  try {
    const path = `${publishDir}/hardhat_non_deployed_contracts.json`;

    const nonDeployedContractsJson = fs.readFileSync(path).toString();
    const nonDeployed = JSON.parse(nonDeployedContractsJson);

    const campaignJson = fs
      .readFileSync(
        `./artifacts/contracts/AttraCampaign.sol/AttraCampaign.json`
      )
      .toString();
    nonDeployed["AttraCampaign"] = JSON.parse(campaignJson).abi;

    const tokenJson = fs
      .readFileSync(`./artifacts/contracts/AttraToken.sol/AttraToken.json`)
      .toString();
    nonDeployed["AttraToken"] = JSON.parse(tokenJson).abi;

    fs.writeFileSync(path, JSON.stringify(nonDeployed, null, 2));
  } catch (e) {
    console.log("Failed to export interfaces to the web app.");
    console.log(e);
    return false;
  }
}

async function main() {
  exportNonDeployed();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
