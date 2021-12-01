import Campaign from "attra-core/campaign.model";
import { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const useEventQuery = (tableName, campaignsRequest, campaignsSetter) => {
  const { Moralis } = useMoralis();
  return useCallback(async () => {
    const query = new Moralis.Query(tableName);
    const sub$ = await query.subscribe();
    sub$.on("create", async () => {
      // => REFRESH CAMPAIGNS
      campaignsSetter(await campaignsRequest());
    });
    return sub$;
  }, [Moralis, campaignsSetter, campaignsRequest, tableName]);
};

const useCampaigns = () => {
  const { Moralis } = useMoralis();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const requestCampaigns = useCallback(async () => {
    try {
      const res = await Moralis.Cloud.run("Campaigns", {});
      const mapped = res.map((rawCampaign) => Campaign.fromObj(rawCampaign));
      console.log("CAMPAIGNS: ", mapped);
      return mapped;
    } catch (error) {
      const code = error.code;
      const message = error.message;
      console.error(code + message);
    }
  }, [Moralis]);

  // CAMPAIGN HAS ADVANCED IN STATUS (INCLUDES CREATED/STARTED)
  const statusQuery = useEventQuery(
    "AdvanceStatus",
    requestCampaigns,
    setCampaigns
  );
  // CAMPAIGN HAS RECEIVED CONTRIBUTION
  const contributionQuery = useEventQuery(
    "Contribution",
    requestCampaigns,
    setCampaigns
  );
  // LOTTERY FINISHED, WINNERS PAID (coincides with status update, redundant but ok for now)
  const payWinnersQuery = useEventQuery(
    "PayWinners",
    requestCampaigns,
    setCampaigns
  );
  const payBenQuery = useEventQuery(
    "PayBeneficiary",
    requestCampaigns,
    setCampaigns
  );

  useEffect(() => {
    requestCampaigns().then(async (campaigns) => {
      setCampaigns(campaigns);
      if (campaigns) setLoading(false);
    });
    const sub1 = statusQuery();
    const sub2 = contributionQuery();
    const sub3 = payWinnersQuery();
    const sub4 = payBenQuery();
    return () => {
      if (sub1.unsubscribe) sub1.unsubscribe();
      if (sub2.unsubscribe) sub2.unsubscribe();
      if (sub3.unsubscribe) sub3.unsubscribe();
      if (sub4.unsubscribe) sub4.unsubscribe();
    };
  }, [
    requestCampaigns,
    statusQuery,
    contributionQuery,
    payWinnersQuery,
    payBenQuery,
  ]);

  return { loading, campaigns };
};

export default useCampaigns;
