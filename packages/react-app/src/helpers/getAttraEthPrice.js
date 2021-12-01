import { getDeployedContract } from "./getDeployedContract";

const network = "rinkeby";

const getAttraEthPrice = async (Moralis) => {
  const { abi, contractAddress } = getDeployedContract("AttraFinance");
  const options = {
    chain: network,
    address: contractAddress,
    function_name: "ethPrice",
    abi: abi,
    params: {},
  };
  // eslint-disable-next-line no-undef
  // const price = await Moralis.Web3API.native.runContractFunction(options);
  const price = 4300;
  return price;
};

export default getAttraEthPrice;
