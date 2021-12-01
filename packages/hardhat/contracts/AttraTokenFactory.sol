pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
import "./AttraToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract AttraTokenFactory {
    address[] campaignTokens;

    event TokenCreated(uint256 timestamp, uint256 roundId, address tkContract);

    constructor() {}

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _id
    ) external returns (address) {
        AttraToken newToken = new AttraToken(_name, _symbol, _id);
        address tkAddr = address(newToken);
        campaignTokens.push(tkAddr);
        newToken.transferOwnership(msg.sender);
        emit TokenCreated(block.timestamp, _id, tkAddr);
        return tkAddr;
    }
}
