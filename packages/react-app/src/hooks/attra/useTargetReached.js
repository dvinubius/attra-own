import { useCallback } from "react";
import { useMoralis } from "react-moralis";

const useTargetReached = () => {
  const { Moralis } = useMoralis();

  const totalCollectedUsd = useCallback(
    (campaign, ethPrice) => {
      const web3 = new Moralis.Web3();
      const ethTotal = +web3.utils.fromWei(campaign.totalCollected);
      return ethTotal * ethPrice;
    },
    [Moralis]
  );

  const targetReached = useCallback(
    (campaign, ethPrice) => {
      const totalInUsd = totalCollectedUsd(campaign, ethPrice); // TODO refactor to be safe against overflows
      return totalInUsd >= campaign.targetUsd;
    },
    [totalCollectedUsd]
  );

  return { targetReached, totalCollectedUsd };
};

export default useTargetReached;
