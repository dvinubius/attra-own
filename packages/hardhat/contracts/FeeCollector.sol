pragma solidity ^0.8.7;

// SPDX-License-Identifier: MIT

/**
 * @dev Manages fees, keeps track of collected fees and transfers them to the treasury when needed.
 *
 * This solution is programatically more complex than just transferring fees to the owner on each contribution.
 * But it saves gas if we only transfer once per campaign.
 */
contract FeeCollector {
    address payable internal _treasuryAddr; // treasury is a singleton and receives fees from all campaigns

    uint256 public contractCreationFee; // FIXED token contract creation
    uint256 public lotteryFee; // FIXED randomness request, winner pick calculation

    uint256 public mintFee; // FIXED PER CONTRIBUTION: for tokens minted on successful campaign

    uint256 public refundFee; // % of each contribution failed campaign refunds
    // fees are given as basis points (2 decimal precision)
    // e.g.
    // fee == 265
    // means 2.65%
    uint256 public minRefundFee; // refund to each contributor

    uint16 public creatorFee; // basis points

    uint256 internal _collectedFees;

    constructor(address payable _treasury) {
        _treasuryAddr = _treasury;
        refundFee = 100; // == 1 %
        minRefundFee = 5000000000000000; // 0.005 ETH
        lotteryFee = 100000000000000000; // 0.1 ETH
    }

    /**
     * Calculates the fee on given amount.
     * Amounts too low for a precise calculation cause revert.
     * Returns amount after fee deduction
     */
    function deductRefundFee(uint256 _amount)
        internal
        returns (uint256 amountAfterFees)
    {
        // iterate over each
        uint256 f = _calcFee(_amount, refundFee);
        f = f > minRefundFee ? f : minRefundFee;

        _collectedFees += f;
        return _amount - f;
    }

    function deductLotteryFee() internal {
        _collectedFees += lotteryFee;
    }

    function payCreatorFee(address payable creator) internal {
        uint256 f = _calcFee(address(this).balance, creatorFee);
        creator.transfer(f);
    }

    function _calcFee(uint256 _amount, uint256 _fee)
        private
        pure
        returns (uint256)
    {
        require(
            (_amount / 10000) * 10000 == _amount,
            "amount too small to accurately apply the fee"
        );
        return (_amount * _fee) / 10000; // 100 for percentage and 100 for 2-decimal precision
    }

    function _transferFeesToTreasury(uint256 _campaignId) internal {
        _treasuryAddr.transfer(_collectedFees);
        _collectedFees = 0;
    }
}
