pragma solidity ^0.8.7;
// SPDX-License-Identifier: MIT

import "./AttraLib.sol";
import "./AttraCampaign.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./Treasury.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol"; // https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/LinkTokenInterface.sol

/**
 * Attra Platform
 *
 * Creates campaigns, keeps track of them.
 * Manages defaults for chainlink integration. (VRF, Price Feed)
 * Owns a Treasury and passes it to any created campaign.
 */
contract AttraFinance is Ownable {
    address payable[] campaigns;
    Treasury treasury;

    address priceFeed;
    address vrfCoordinator;
    address link;
    bytes32 keyHash;
    uint256 vrfFee;
    address tokenFactoryAddr;

    event CreateCampaign(
        uint256 indexed campaignId,
        string name,
        uint256 duration,
        address indexed creator,
        address beneficiary,
        uint16 prizeBasisPoints,
        uint256 minContributionUSD,
        uint256 targetUSD,
        uint8 winnerPicks,
        uint16 creatorFee,
        string tokenName,
        string tokenSymbol
    );

    event AdvanceStatus(
        uint256 indexed id,
        AttraLib.CampStatus indexed newStatus
    );

    event Contribution(
        uint256 indexed campaignId,
        uint256 indexed amount,
        address indexed contributor,
        uint256 counter,
        uint256 totalAmount
    );

    event PayWinners(
        uint256 indexed campaignId,
        uint256 indexed amount,
        address winner1,
        address winner2,
        address winner3
    );

    event PayBeneficiary(
        uint256 indexed campaignId,
        uint256 indexed amount,
        address indexed beneficiary
    );

    event Refund(uint256 indexed campaignId);

    event LinkFunding(uint256 indexed campaignId, address indexed funder);

    event PayCreator(uint256 indexed campaignId, uint256 indexed amount);

    constructor(
        address _priceFeed,
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _vrfFee,
        address _tokenFactory
    ) {
        priceFeed = _priceFeed;
        vrfCoordinator = _vrfCoordinator;
        link = _link;
        keyHash = _keyHash;
        vrfFee = _vrfFee;
        tokenFactoryAddr = _tokenFactory;

        treasury = new Treasury();
    }

    // should be multisig instead of onlyOwner
    function withdrawFromTreasury(uint256 amt, address payable receiver)
        public
        onlyOwner
    {
        treasury.withdrawTo(amt, receiver);
    }

    // --------------------- CAMPAIGNS --------------------

    function createCampaign(
        string memory _name,
        uint256 _duration,
        address payable _beneficiary,
        uint16 _prize,
        uint8 _numberOfPicks,
        uint256 _minContributionUsd,
        uint256 _targetUsd,
        uint16 _creatorFee,
        string memory _tokenName,
        string memory _tokenSymbol
    ) public {
        uint256 id = campaigns.length;
        AttraCampaign newCamp = new AttraCampaign(
            id,
            priceFeed,
            payable(treasury),
            vrfCoordinator,
            link,
            keyHash,
            vrfFee,
            tokenFactoryAddr
        );
        campaigns.push(payable(newCamp));
        AttraLib.CampaignInitConfig memory cfg = AttraLib.CampaignInitConfig(
            _name,
            _duration,
            payable(msg.sender),
            _beneficiary,
            _prize,
            _minContributionUsd,
            _targetUsd,
            _numberOfPicks,
            _creatorFee,
            _tokenName,
            _tokenSymbol
        );
        AttraLib.CampStatus newStatus = newCamp.init(cfg);
        emit AdvanceStatus(id, newStatus);
        emitStarted(id, cfg);
    }

    /**
     * workaround for stack too deep error
     */
    function emitStarted(uint256 id, AttraLib.CampaignInitConfig memory cfg)
        private
    {
        emit CreateCampaign(
            id,
            cfg.name,
            cfg.duration,
            cfg.creator,
            cfg.beneficiary,
            cfg.prize,
            cfg.minContributionUsd,
            cfg.targetUsd,
            cfg.numberOfPicks,
            cfg.creatorFee,
            cfg.tokenName,
            cfg.tokenSymbol
        );
    }

    // ------------------------------------------

    function setPriceFeed(address _priceFeed) public {
        priceFeed = _priceFeed;
    }

    // ------------------------------------------

    // ------------- PROXY FUNCTIONS ----------- //
    // TODO easier this way, for now. waiting for better support from Moralis
    // to sync events via API call (dynamically add contract to be synced)

    function contribute(uint256 _campaignId) public payable {
        AttraCampaign camp = AttraCampaign(campaigns[_campaignId]);
        camp.contribute{value: msg.value}(payable(msg.sender));
        emit Contribution(
            _campaignId,
            msg.value,
            msg.sender,
            camp.contributionCounter(),
            camp.totalCollected()
        );
    }

    function advance(uint256 _campaignId) public {
        AttraCampaign camp = AttraCampaign(campaigns[_campaignId]);
        AttraLib.CampStatus newStatus = camp.advance();
        emit AdvanceStatus(_campaignId, newStatus);

        if (newStatus == AttraLib.CampStatus.SUCCESS_SETTLED_WINNERS) {
            (
                uint256 prize,
                address winner1,
                address winner2,
                address winner3
            ) = camp.getLotteryResult();
            emit PayWinners(_campaignId, prize, winner1, winner2, winner3);
        }
        if (newStatus == AttraLib.CampStatus.FAIL_SETTLED) {
            emit Refund(_campaignId);
        }
    }

    function notifyReceivedSeed(uint256 id) external {
        require(msg.sender == campaignById(id), "caller must be a campaign");
        emit AdvanceStatus(id, AttraLib.CampStatus.SUCCESS_READY_FOR_LOTTERY);
    }

    /**
     * Beneficiary gets paid,
     * Non-winning contributors get their participation tokens.
     * Restricting this to be called only by the beneficiary.
     *
     * NOT AUTOMATED:
     * We don't call this via keepers (for now), since it makes sense fore
     * the beneficiary to support the costs of minting all the tokens. It's more
     * transparent this way, and also technically simpler.
     * Should it turn out that automating this step is the better way to go,
     * this function can be removed.
     *
     * NOT COMPLETELY PUBLIC:
     * In case the beneficiary loses access to their keys, the funds cannot be accidentally
     * sent to them by any public person.
     */
    function settleBeneficiary(uint256 _campaignId) public {
        AttraCampaign camp = AttraCampaign(campaigns[_campaignId]);
        address beneficiary = camp.beneficiary();
        require(msg.sender == beneficiary, "Only the beneficiary");

        uint256 amountPaidOut = camp.settleBeneficiaryAndTokens();
        emit PayBeneficiary(_campaignId, amountPaidOut, beneficiary);
        emit AdvanceStatus(_campaignId, camp.status());
    }

    function fundCampaignWithLink(uint256 _campaignId) public {
        LinkTokenInterface LINK = LinkTokenInterface(link);
        require(
            LINK.allowance(msg.sender, address(this)) >= vrfFee,
            "Allowance not given for needed link amount"
        );
        LINK.transferFrom(msg.sender, campaigns[_campaignId], vrfFee);
        emit LinkFunding(_campaignId, msg.sender);
    }

    // function withdrawLink() public onlyOwner {
    //     LinkTokenInterface LINK = LinkTokenInterface(link);
    //     LINK.transfer(owner(), LINK.balanceOf(address(this)));
    // }

    // ------------------------------------------

    // ------------- PUBLIC INTEREST -------------

    function totalCampaigns() public view returns (uint256) {
        return campaigns.length;
    }

    function campaignById(uint256 _id) public view returns (address) {
        return address(campaigns[_id]);
    }

    function treasuryAddress() public view returns (address) {
        return address(treasury);
    }

    function ethPrice() public view returns (uint256) {
        AggregatorV3Interface feed = AggregatorV3Interface(priceFeed);
        (, int256 price, , , ) = feed.latestRoundData();
        return uint256(price);
    }

    function campaignStatus(uint256 _id)
        public
        view
        returns (AttraLib.CampStatus)
    {
        AttraCampaign camp = AttraCampaign(campaigns[_id]);
        return camp.status();
    }
}
