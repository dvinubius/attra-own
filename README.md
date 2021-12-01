# Attra - Ethereum app for incentive-boosted crowdfunding

- Chainlink Hackathon submission

- Deployed on Rinkeby
  - [attra main contract](https://rinkeby.etherscan.io/address/0xB06ce3f7432290EBFaE3cc8CAD2Fa9e5dBFD4F90)
  - [attra token factory](https://rinkeby.etherscan.io/address/0x1F30c1970FA46Ad9B798B580bed5537e1536e403)

Both contracts are verified.

In this repo there may be improvements on the smart contract documentation (comments in solidity) which are only visible in the repo code, not in the verified contracts themselves.

The deployed contracts are the ones used in the **most recently submitted demo video**. I decided not to keep that deployment for a better reference.

### For the jury's consideration

Due to the Kovan network being extremely slow in the hours before the deadline (10 minutes blocktime) it was not possible to properly demo the project via the web ui.
Since I was not sure why, I tried different solutions. Among them, I made some ineffective changes to the code, mainly commenting out functionality that is not yet deployment ready anyway, in order to reduce the contract size which had gotten very close to 24K.

This is a **cleaned up version** of the submitted code, also changing the deployment network from the initial kovan to the (currently) much faster rinkeby.

Apart from using rinkeby there are no significant changes of functionality on this branch. It is created for your convenience in order to easier evaluate the project quality.


