pragma solidity ^0.8.7;

// SPDX-License-Identifier: MIT

interface IAttraTokenFactory {
    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _id
    ) external returns (address);
}
