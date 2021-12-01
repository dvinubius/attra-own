pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol
import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract AttraToken is ERC721, Ownable {
    uint256 campaignId;
    uint256[] _amounts;

    // TODO tokenURI nice to have but not essential for POC

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 _campaignId
    ) ERC721(name_, symbol_) {
        campaignId = _campaignId;
    }

    function mintForContribution(address _contributor, uint256 _amount)
        external
        onlyOwner
    {
        uint256 id = _amounts.length;
        _amounts.push(_amount);
        _safeMint(_contributor, id);
    }

    function contributionAmount(uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        return _amounts[_tokenId];
    }
}
