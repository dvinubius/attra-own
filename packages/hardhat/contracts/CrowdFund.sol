pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "./ContributionFilter.sol";
import "./AttraToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

/**
 * Takes contributions, keeps track of them.
 */
contract CrowdFund is ContributionFilter, Ownable {
    bool private isOpen;
    uint256 public totalCollected;
    uint256 public contributionCounter;

    struct AggregateContribution {
        uint256 contributorIdx;
        uint256 amount;
    }
    mapping(address => AggregateContribution) private aggregateContributions;
    address payable[] public contributors; // ensure is a SET (array of unique addresses)

    constructor(address _priceFeed) ContributionFilter(_priceFeed) {}

    function lengthContributors() public view returns (uint256) {
        return contributors.length;
    }

    function contributionOf(address contributor) public view returns (uint256) {
        return aggregateContributions[contributor].amount;
    }

    function contributionAtIdx(uint256 contributorIdx)
        external
        view
        onlyOwner
        returns (uint256)
    {
        return contributionOf(contributors[contributorIdx]);
    }

    function open(uint256 _minAmountUsd) external onlyOwner {
        isOpen = true;
        minAmountUsd = _minAmountUsd;
    }

    function close() external onlyOwner {
        isOpen = false;
    }

    function addContribution(address payable _contributor)
        external
        payable
        onlyMinAmount
    {
        require(isOpen, "Fund collection is over");

        if (aggregateContributions[_contributor].amount == 0) {
            contributors.push(_contributor);
            aggregateContributions[_contributor] = AggregateContribution({
                amount: msg.value,
                contributorIdx: contributors.length - 1
            });
        } else {
            aggregateContributions[_contributor].amount += msg.value;
        }
        totalCollected += msg.value;
        contributionCounter++;
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        payable(owner()).transfer(amount);
    }

    function balanceInUSD() public view returns (uint256) {
        return toUSD(address(this).balance);
    }

    function totalCollectedInUSD() public view returns (uint256) {
        return toUSD(totalCollected);
    }
}
