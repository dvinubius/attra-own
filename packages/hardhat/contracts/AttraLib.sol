pragma solidity ^0.8.7;

// SPDX-License-Identifier: MIT

/**
 * Attra shared across contracts
 */
library AttraLib {
    enum CampStatus {
        FRESH,
        OPEN,
        SUCCESS_PREPARE_LOTTERY,
        SUCCESS_READY_FOR_LOTTERY,
        SUCCESS_SETTLED_WINNERS,
        SUCCESS_SETTLED_BENEFICIARY,
        FAIL_SETTLED
    }

    struct CampaignInitConfig {
        string name;
        uint256 duration;
        address payable creator;
        address payable beneficiary;
        uint16 prize;
        uint256 minContributionUsd;
        uint256 targetUsd;
        uint8 numberOfPicks;
        uint16 creatorFee;
        string tokenName;
        string tokenSymbol;
    }

    struct LotteryResult {
        address winner1;
        address winner2;
        address winner3;
        uint256 prizePaidOut;
    }
}
