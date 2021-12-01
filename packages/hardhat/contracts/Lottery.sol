pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

/**
 * Manages details regarding the campaign lottery setup.
 * Interacts with Chainlink VRF
 * Base contract for an AttraCampaign, but has no implementation
 * for the raffle procedure itself.
 */
abstract contract Lottery is VRFConsumerBase {
    uint8 numberOfPicks;
    bytes32 keyHash;
    uint256 vrfFee;
    // bytes32 public reqId; // for debugging only, TODO remove in production
    uint256 receivedRandomness;

    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _vrfFee
    ) VRFConsumerBase(_vrfCoordinator, _link) {
        keyHash = _keyHash;
        vrfFee = _vrfFee;
    }

    function startLottery() internal {
        require(
            LINK.balanceOf(address(this)) >= vrfFee,
            "Not enough LINK to perform the lottery"
        );
        // reqId = requestRandomness(keyHash, vrfFee);
        requestRandomness(keyHash, vrfFee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        virtual
        override
    {
        receivedRandomness = randomness;
        _onReceivedRandomness();
    }

    function _onReceivedRandomness() internal virtual;

    function _expand(uint256 randomValue, uint8 n)
        internal
        pure
        returns (uint256[] memory expandedValues)
    {
        expandedValues = new uint256[](n);
        for (uint8 i = 0; i < n; i++) {
            expandedValues[i] = uint256(keccak256(abi.encode(randomValue, i)));
        }
        return expandedValues;
    }

    function hasEnoughLink() internal view returns (bool) {
        return LINK.balanceOf(address(this)) >= vrfFee;
    }

    // ------------- SETTERS -------------

    function setKeyHash(bytes32 _keyHash) public {
        keyHash = _keyHash;
    }

    function setVrfFee(uint256 _vrfFee) public {
        vrfFee = _vrfFee;
    }
}
