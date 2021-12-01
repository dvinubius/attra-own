pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "./AttraLib.sol";
import "./FundManager.sol";
import "./AttraFinance.sol";
import "./Lottery.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol"; // https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol

/**
 * Public face of a campaign.
 * Campaign State Machine.
 * Public proxies to FundManager functions.
 * Lottery implementation.
 *
 * Balance during the AttraCampaign / FundManager lifecycle:
 *
 * As funds are being collected, they are kept in the CrowdFund contract.
 * When lottery completes, in a single TX:
 * - funds are withdrawn from the crowdfund & distributed to winners
 * - fees are retained and transferred to the treasury
 * - the remaining balance stays in the AttraCampaign
 * A subsequent call to settleBeneficiaryAndTokens() is then made by the
 * beneficiary; it triggers the distribution of tokens and leaves the
 * campaign with an empty balance.
 *
 *
 */
contract AttraCampaign is KeeperCompatibleInterface, FundManager, Lottery {
    // flags for the concluding state machine
    AttraLib.CampStatus public status;

    string public name;
    uint256 public start; // seconds since epoch according to current block
    uint256 public duration; // duration of the current campaign in seconds

    constructor(
        uint256 _id,
        address _priceFeed,
        address payable _treasury,
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _vrfFee,
        address _tokenFactoryAddr
    )
        FundManager(_id, _priceFeed, _treasury, _tokenFactoryAddr)
        Lottery(_vrfCoordinator, _link, _keyHash, _vrfFee)
    {
        status = AttraLib.CampStatus.FRESH;
    }

    function id() public view returns (uint256) {
        return _myId;
    }

    // -------------- CAMPAIGN MANAGEMENT -----------

    // TODO tokenURI nice to have but not essential now
    function init(AttraLib.CampaignInitConfig calldata cfg)
        external
        onlyOwner
        returns (AttraLib.CampStatus)
    {
        require(bytes(cfg.name).length > 0, "A campaign must have a name");
        name = cfg.name;
        require(cfg.duration != 0, "The campaign duration cannot be 0");
        require(
            cfg.creatorFee < 5000,
            "The creator fee must be lower than 50%"
        );
        status = AttraLib.CampStatus.OPEN;

        start = block.timestamp;
        duration = cfg.duration;
        numberOfPicks = cfg.numberOfPicks;
        creatorFee = cfg.creatorFee;

        openFund(
            cfg.beneficiary,
            cfg.prize,
            cfg.minContributionUsd,
            cfg.targetUsd,
            cfg.tokenName,
            cfg.tokenSymbol
        );
        return status;
    }

    function _isDurationEllapsed()
        internal
        view
        virtual
        override
        returns (bool)
    {
        return (block.timestamp - start) > duration;
    }

    // ------- CONCLUDING ------- //

    function _isTargetAchieved() private view returns (bool) {
        return crowdFund.balanceInUSD() >= minTotalAmountUsd;
    }

    /**
     * As a safety measure anyone can call this.
     * In case the Keeper doesn't have LINK / is not available anymore.
     * Or in case the owner has lost control over the keeper.
     * @dev status after advance() should have changed indeed,
     * if no status change happened, revert (internal error / faulty logic  )
     */
    function advance() public returns (AttraLib.CampStatus result) {
        AttraLib.CampStatus initialStatus = status;
        if (status == AttraLib.CampStatus.OPEN) {
            require(_canClose(), "Campaign is still open for contributions");
            _closeCampaign();
        } else if (status == AttraLib.CampStatus.SUCCESS_PREPARE_LOTTERY) {
            revert("waiting for randomness from Chainlink VRF");
            // TODO add safety function: after x duration of being in this state it should be possible to just trigger refunds
        } else if (status == AttraLib.CampStatus.SUCCESS_READY_FOR_LOTTERY) {
            _completeLottery();
        } else if (status == AttraLib.CampStatus.SUCCESS_SETTLED_WINNERS) {
            // TODO add safety function: after x duration of being in this state it should be possible to trigger refunds (multisig?)
        }
        require(status != initialStatus, "status should have changed");

        result = status;
    }

    function _canClose() private view returns (bool) {
        return _isDurationEllapsed() || _isTargetAchieved();
    }

    function _closeCampaign() private {
        closeFund();
        bool successful = _isTargetAchieved();
        if (successful) {
            // make VRF request, finalize on VRF callback
            startLottery();
            status = AttraLib.CampStatus.SUCCESS_PREPARE_LOTTERY;
        } else {
            // finalize immediately with refunds
            _refundAll();
            status = AttraLib.CampStatus.FAIL_SETTLED;
        }
    }

    function _onReceivedRandomness() internal virtual override {
        status = AttraLib.CampStatus.SUCCESS_READY_FOR_LOTTERY;
        AttraFinance attra = AttraFinance(owner());
        attra.notifyReceivedSeed(_myId);
    }

    function _completeLottery() private {
        _pickWinner(receivedRandomness);
        _proceedAfterLottery();
        status = AttraLib.CampStatus.SUCCESS_SETTLED_WINNERS;
    }

    /**
     * Pick winning tickets considering contributed amounts.
     *
     * The method resembles a procedure where players have numbered tickets,
     * some of them having more tickets than others, therefore higher chances of winning.
     * When there are several picks, the same person may hold several of the winning tickets.
     *
     * The prize is distributed among winners, so the multi-winner gets more of the prize.
     *
     * We form an array of accumulated contribution amounts corresponding to each
     * contributor together with all the ones that came before them.
     * The winning tickets correspond to particular accumulation bins.
     */
    function _pickWinner(uint256 _randomness) internal {
        uint256[] memory rands = _expand(_randomness, numberOfPicks);
        uint256[] memory winnerPicks = new uint256[](numberOfPicks);
        uint256 _totalCollected = address(crowdFund).balance;
        for (uint8 i = 0; i < numberOfPicks; i++) {
            winnerPicks[i] = rands[i] % _totalCollected;
        }
        // find the contributor indexes corresponding to the winnerPicks
        uint256 _poolSize = crowdFund.lengthContributors();
        uint256 acc = 0;
        uint256 prevLimit = 0;
        for (
            uint256 contributorIdx = 0;
            contributorIdx < _poolSize;
            contributorIdx++
        ) {
            // creating the bin corresponding to this contributor
            uint256 amt = crowdFund.contributionAtIdx(contributorIdx);
            acc += amt;
            // check if any of the winnerPicks is this contributor's bin
            for (uint8 j = 0; j < numberOfPicks; j++) {
                if (acc > winnerPicks[j] && winnerPicks[j] >= prevLimit) {
                    winnerIdxs.push(contributorIdx);
                }
            }
            prevLimit = acc;
        }
    }

    function settleBeneficiaryAndTokens() external onlyOwner returns (uint256) {
        uint256 amount = _settleBenAndTokens();
        status = AttraLib.CampStatus.SUCCESS_SETTLED_BENEFICIARY;
        return amount;
    }

    // ------------ AUTOMATION with KEEPERS

    /**
     * Returns true also in cases of target achieved && duration not ellapsed.
     *  -> a campaign with no registered upkeep may remain open for contributions
     *     all the way until duration ellapsed, allowing for way more than is set
     *     as a target
     *  -> a campaign with upkeep will conveniently close as soon as target is meat
     */
    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory)
    {
        bool needsLink = status == AttraLib.CampStatus.OPEN &&
            _canClose() &&
            _isTargetAchieved();
        if (needsLink && !hasEnoughLink()) {
            upkeepNeeded = false;
        } else {
            upkeepNeeded =
                (status == AttraLib.CampStatus.OPEN && _canClose()) || // first advance - refunds on fail / VRF request on success
                status == AttraLib.CampStatus.SUCCESS_READY_FOR_LOTTERY; // use VRF result - pick winners, pay them

            // beneficiary payout goes with participation token minting and should be triggered by beneficiary
        }
    }

    function performUpkeep(bytes calldata) external override {
        advance();
    }

    // ----------------------------------
}
