pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ContributionFilter {
    AggregatorV3Interface internal priceFeed;
    uint256 public minAmountUsd;

    /**
     * Network: Rinkeby
     * Aggregator: ETH/USD
     * Address: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
     */
    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    modifier onlyMinAmount() {
        uint256 usdAmount = toUSD(msg.value);
        require(
            usdAmount >= minAmountUsd,
            "contribution is below the minimum required, as currently valued in USD"
        );
        _;
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function precision() public view returns (uint8) {
        return priceFeed.decimals();
    }

    function toUSD(uint256 _weiValue) internal view returns (uint256) {
        return (getLatestPrice() * _weiValue) / 10**8 / 10**18;
    }

    /**
     * Returns current conversion rate according to the on-chain price feed.
     * Useful for amount validation in the frontend UI when contributing
     */
    function ethPrice() public view returns (uint256) {
        return getLatestPrice();
    }

    function minAmountWei() public view returns (uint256) {
        uint256 minUSD = minAmountUsd * 10**18;
        uint256 price = getLatestPrice(); // usd per eth
        uint256 precisionFactor = 10**precision();
        return ((minUSD * precisionFactor) / price);
    }
}
