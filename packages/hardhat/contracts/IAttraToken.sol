pragma solidity ^0.8.7;

// SPDX-License-Identifier: MIT

interface IAttraToken {
    function mintForContribution(address _contributor, uint256 _amount)
        external;
}
