const { ethers } = require("ethers");

export const getTopicForEvent = (contractABI, eventName) => {
  // creating the interface of the ABI
  const iface = new ethers.utils.Interface(contractABI);
  // get all events from interface
  const events = iface.events;
  // filter for Transfer
  const topic = Object.values(events).find((ev) => ev.name === eventName);

  //   {
  //     "name": "CreateCampaign",
  //     "anonymous": false,
  //     "inputs": [
  //         {
  //             "name": "timestamp",
  //             "type": "uint256",
  //             "indexed": false,
  //             "components": null,
  //             "arrayLength": null,
  //             "arrayChildren": null,
  //             "baseType": "uint256",
  //             "_isParamType": true
  //         },
  //         {
  //             "name": "id",
  //             "type": "uint256",
  //             "indexed": false,
  //             "components": null,
  //             "arrayLength": null,
  //             "arrayChildren": null,
  //             "baseType": "uint256",
  //             "_isParamType": true
  //         }
  //     ],
  //     "type": "event",
  //     "_isFragment": true
  // }

  const signature = `${topic.name}(${topic.inputs
    .map((input) => input.type)
    .join(",")})`;
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature));
};
