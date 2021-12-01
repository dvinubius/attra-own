pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "./CrowdFund.sol";
import "./AttraLib.sol";
import "./FeeCollector.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

import "./IAttraTokenFactory.sol";
import "./IAttraToken.sol";

/**
 * @dev Takes care of settlements
 * - refunds
 * - payments
 * - participation token emissions
 *
 * Is a FeeCollector: triggers the accounting of fees while it settles payments.
 * After a post-lottery settlement (transfers to winners) all retained fees are transferred
 * to the treasury.
 *
 * To be extended by AttraCampaign.
 *
 * Owns a CrowdFund which handles fund contribution management.
 *
 */
abstract contract FundManager is FeeCollector, Ownable {
    uint256 internal _myId;
    // bytes32 private requestId; // TODO set visibility to private in production
    CrowdFund crowdFund; // manages collection of funds
    IAttraTokenFactory tokenFactory;

    address payable public creator; // the one who created the campaign
    address payable public beneficiary; // who gets the funds of the current campaign (if successful)

    uint256[] public winnerIdxs;
    AttraLib.LotteryResult public lotteryResult;

    uint16 public prizePercentage; // basis points (0 .. 10000) how much of the total contributed is the prize of the lottery winner
    uint256 public minTotalAmountUsd; // target for total amount for current campaign. must be meat for campaign to be valid
    uint256 public minContAmountUsd; // amount per contribution during current campaign

    // properties of the contribution token
    string public tokenName;
    string public tokenSymbol;
    address public tokenAddress;

    modifier onEmptyBalance() {
        require(
            address(this).balance == 0,
            "FundManager should have an empty balance before settlements"
        );
        _;
    }

    constructor(
        uint256 _id,
        address _priceFeed,
        address payable _treasury,
        address _tokenFactoryAddr
    ) FeeCollector(_treasury) {
        _myId = _id;
        crowdFund = new CrowdFund(_priceFeed);
        tokenFactory = IAttraTokenFactory(_tokenFactoryAddr);
    }

    // ----------- FUND MANAGEMENT ---------------

    function openFund(
        address payable _beneficiary,
        uint16 _prizePercentage,
        uint256 _minAmountUsd,
        uint256 _targetAmountUsd,
        string memory _tokenName,
        string memory _tokenSymbol
    ) internal {
        require(_prizePercentage > 0, "The prize must be non-zero");
        require(_prizePercentage <= 3300, "The prize must be lower than 33%");
        require(_targetAmountUsd != 0, "Target amount must be non-zero.");
        require(_minAmountUsd != 0, "Minimum contribution must be non-zero.");
        require(
            _minAmountUsd * 2 < _targetAmountUsd,
            "Min contribution must be lower than half the target"
        );

        beneficiary = _beneficiary;
        prizePercentage = _prizePercentage;
        minContAmountUsd = _minAmountUsd;
        minTotalAmountUsd = _targetAmountUsd;
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;

        crowdFund.open(_minAmountUsd);
    }

    function closeFund() internal {
        crowdFund.close();
    }

    // --------------- CONTRIBUTIONS

    function contribute(address payable contributor)
        external
        payable
        onlyOwner
    {
        require(!_isDurationEllapsed(), "Fund collection is over");
        crowdFund.addContribution{value: msg.value}(contributor);
    }

    function contributionCounter() public view returns (uint256) {
        return crowdFund.contributionCounter();
    }

    function totalCollected() public view returns (uint256) {
        return crowdFund.totalCollected();
    }

    function totalCollectedInUSD() public view returns (uint256) {
        return crowdFund.totalCollectedInUSD();
    }

    function _isDurationEllapsed() internal view virtual returns (bool);

    function minAmountInWei() public view returns (uint256) {
        return crowdFund.minAmountWei();
    }

    // --------------------------------------------

    // ----- ABLE TO RECEIVE fund withdrawals -----

    receive() external payable {
        require(
            msg.sender == address(crowdFund),
            "Can only receive from my crowdfund"
        );
    }

    // ------------------------------------

    // ----------------- SETTLEMENTS -----------

    /**
     * Refund contributors while applying & retaining fees
     */
    function _refundAll() internal onEmptyBalance {
        crowdFund.withdraw();
        for (uint256 i = 0; i < crowdFund.lengthContributors(); i++) {
            address payable contributor = payable(crowdFund.contributors(i));
            uint256 contribAmt = crowdFund.contributionOf(contributor);
            uint256 refundAmt = deductRefundFee(contribAmt); // side effects - fees being accounted
            contributor.transfer(refundAmt);
        }
        _transferFeesToTreasury(_myId); // accounted fees go into the protocol treasury
    }

    function _proceedAfterLottery() internal onEmptyBalance {
        crowdFund.withdraw();
        // -- MY FEES (no transfers, only accounting)
        deductLotteryFee(); // fixed fee

        //-- FEE to campaign creator
        payCreatorFee(creator); // fee applied on total collected funds

        // -- WINNER PAYMENT (operates on total collected amount)
        uint256 _prize = _payWinners(); // non-winner funds remain
        _saveLotteryResult(_prize);

        // -- FEES TRANSFER
        _transferFeesToTreasury(_myId);
    }

    /**
     * refunds + prizes
     *
     * Fair split: each winner receives a part of the prize
     * that is proportional to their own contribution
     * in relation to the other winners' contribution
     */
    function _payWinners() private returns (uint256) {
        address[] memory winners = new address[](winnerIdxs.length);
        uint256[] memory refunds = new uint256[](winnerIdxs.length);
        uint256 totalRefund;

        for (uint8 i = 0; i < winnerIdxs.length; i++) {
            winners[i] = crowdFund.contributors(winnerIdxs[i]);
            refunds[i] = crowdFund.contributionAtIdx(winnerIdxs[i]);
            totalRefund += refunds[i];
        }

        // prizes
        uint256 nonWinnerContributions = address(this).balance - totalRefund;
        uint256 prize = (nonWinnerContributions * prizePercentage) / 10000;
        for (uint8 i = 0; i < winnerIdxs.length; i++) {
            // INITIAL
            // uint256 prizePart = (prize * crowdFund.contributionAtIdx(i)) /
            //     totalRefund;

            // CORRECTED - helps prevent whale abuse
            // split prize evenly among winners regardless of their contributions
            uint256 prizePart = prize / winnerIdxs.length;
            payable(winners[i]).transfer(refunds[i] + prizePart);
        }
        return prize;
    }

    function _saveLotteryResult(uint256 prizePaidOut) private {
        lotteryResult.prizePaidOut = prizePaidOut;
        if (winnerIdxs.length > 0) {
            lotteryResult.winner1 = crowdFund.contributors(0);
        }
        if (winnerIdxs.length > 1) {
            lotteryResult.winner2 = crowdFund.contributors(1);
        }
        if (winnerIdxs.length > 2) {
            lotteryResult.winner3 = crowdFund.contributors(2);
        }
    }

    function getLotteryResult()
        public
        view
        returns (
            uint256,
            address,
            address,
            address
        )
    {
        return (
            lotteryResult.prizePaidOut,
            lotteryResult.winner1,
            lotteryResult.winner2,
            lotteryResult.winner3
        );
    }

    function _settleBenAndTokens() internal returns (uint256) {
        _issueTokens();
        uint256 amount = address(this).balance;
        beneficiary.transfer(amount);
        return amount;
    }

    /**
     * Create token contract & mint tokens to contributors.
     */
    function _issueTokens() private {
        //console.log(" * * Distributing Tokens");
        // create token specific to this round
        IAttraToken tk = IAttraToken(
            tokenFactory.createToken(tokenName, tokenSymbol, _myId)
        );

        // mint to all contributors except the winners
        uint256 howMany = crowdFund.lengthContributors();
        for (uint256 i = 0; i < howMany; i++) {
            address payable contributor = crowdFund.contributors(i);
            if (_isWinningIdx(i)) {
                continue;
            }
            uint256 amount = crowdFund.contributionOf(contributor);
            tk.mintForContribution(contributor, amount);
        }
        tokenAddress = address(tk);
    }

    function _isWinningIdx(uint256 idx) private view returns (bool) {
        for (uint8 i = 0; i < winnerIdxs.length; i++) {
            if (winnerIdxs[i] == idx) {
                return true;
            }
        }
        return false;
    }

    // ------------------------------------

    // -------------- MY MONEY ------------

    function withdraw(uint256 _amount) public onlyOwner {
        require(
            address(this).balance >= _amount,
            "balance too low for this withdrawal"
        );
        payable(owner()).transfer(_amount);
    }

    // ------------------------------------
}
