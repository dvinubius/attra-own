- Random Documentation
- Rationale for design choices
- More ideas...


### Campaign Params Discussion

CAMPAIGN

                                      DATA MODEL                      Creator UI

    target amount : T                 WEI                             USD
                                      T > 0                           text input

    min contrib.  : MC                WEI                             USD
                                      0.0000001 * T < MC < 0.5 * T    text input
                                      a max of 1,000,000 contribs

    duration: d                       seconds                         PoC - plain seconds text input
                                                                      MVP - date with hours and minutes, calc in UI
                                    
Campaign starts the moment it is created
Conditions ensure there will be no more than 10000 contributions


LOTTERY

    prize : % of funds from others      - slider

    winners: how many (1 - 3)           - radio buttons with visuals (icons)


# V0 / POC: Attra Finance - incentivize-boosted crowdfunding

## Concept

Crowdfund with designable incentives.
Experiment as campaign creator.
Join campaign as investor/gambler.
## Incentives
=> Possibility of gains may help potential contributors to decide and take the step. 

=> Potential winner has unlimited upside potential (you never know how many people will contribute)

=> After winning you can still contribute if you want to (forfeit refund or forfeit your prize) 
  -> true-believer status

=> Losing in the lottery is acceptable if you want to contribute anyway.

=> After a successful campaign, *tAcct* never receives *Total*, but *Total* * (1 - *Y*) - *X* . Should be acceptable for them.

## Advanced Campaign Designer
inspired by Rari Fuse Pools
**Multiple campaigns with designed incentives: mix & match**

## Technical Details

Contribution Tokens only to contributors, not to beneficiary. Only minting happens here, then they are merely redeemable for smthing else.

CHAINLINK
Keeper for expiry date.
VRF for winner. 
External adapter for more complex lotteries? ( PoC - lottery draw weighted by total amount)
Price feed for correct ETH price (check contribution amount expressed in USD)

## User value vs. Tech

Funds safety - not dependent on OWNER, LINK in lotteryfund, existence of LINK_NODEs.

- Anyone can advance a campaign. The ususal flow is then triggered.
- No LINK in the lottery
  - can be transfered via public function by anyone
  - does the vrf fee ever need to be adjusted?
- No LINK nodes to do the job
  - v1 : no solution
  - v2: multisig to skip lottery or just refund everybody

No Link in the contract?

  1. Keepers only for convenience - if lotteryFund has no link for upkeep jobs, they just don't happen. Then campaigns must be advanced by actively calling the advance function.
     
  2. Lottery may not happen when no LINK.


# V1: Mainnet Launch on StarkNet / Polygon / ?

## V1.1: NFTs for charity
The beneficiary might design their own media to represent them. 
They would also be able to use our templates.
The beneficiary would typically give us their media files, the rest is
handled by us as a service.

# V2: Advanced Campaign Designer

Concept inspired by Pool Together & Rari Fuse Pools

**Multiple campaigns with designed incentives: mix & match**
### Funds are earning yield while waiting for campaign to end.
       => WHAT TO DO with the generated value? Let campaign creators decide & experiment.

  A. FAILED CAMPAIGN
    i. to owner
    ii. to beneficiary
    iii. to contributors
  B. SUCCESSFUL CAMPAIGN
    i. to owner
    ii. to beneficiary
    iii. contributors
      a. each according to amount
      b. winner all
      c. non-winner all, according to amount

UI for fluid distribution of % over choices. Ex for B: 10% owner, 80% winner, 10% non-winners

Default settings: A: 100% contributors & B: 100% iii a 

RATIOANLE: 
- yield for owner / beneficiary if they are sure to be able to do a good job at promoting the campaign.
- yield for contributors: incentivize participation if platform is new / if you think you need it for a successful promotion
- allow for specialized campaign creators as a service providers
  
      => successful campaigns become yield generating assets
        => they can be tokenized as NFTs and traded (transfer of the nft ivolves ownership transfer of the campaign) 

EXTRAS for UX:
- beneficiary may keep funds invested in yield yearning position until actually using them
- contributors may decide whether they're "all in" for a potential lottery win, or want to split their contribution in case of a win.


# V3 - Refined Use Cases
## A: DiscreetCampaign - brand to incentivize participation where privacy is required
Wrap as dApp on Secret Network after IBC integration upgrade. All campaigns become privacy-preserving by default in terms of
the contributors. 
--> May unlock larger involvements (high stake gambling by entities who would not have done it in the open (Mainnet)).
--> Privacy would be opt-out at campaign-level, decision to be made by campaign designer.

## B: NobleCampaign - brand to incentivize charitable donations (social signaling opportunity for whales with gambling affinity)
lottery for **whales only**, and for **charity only**
you can only stake if you are a whale (you have more than z in that account / in an account that you control (sign to prove - zkp))

z is set by the system - how much of a whale do contributors need to be?

charitable cause is determined via social voting

True-believer (forfeiter) would be a social hero

### Tech
Chainlink API call for social voting. -> is the stated charity cause legit?
