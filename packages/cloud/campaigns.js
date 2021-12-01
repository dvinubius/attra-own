Moralis.Cloud.define("Campaigns", async (request) => {
  const created = new Parse.Query("CreateCampaign");
  const advanced = new Parse.Query("AdvanceStatus");
  const contribution = new Parse.Query("Contribution");
  const payWinners = new Parse.Query("PayWinners");
  const payBeneficiary = new Parse.Query("PayBeneficiary");
  const refund = new Parse.Query("Refund");

  const createdRes = await created.find();
  const advancedRes = await advanced.find();
  const contributionRes = await contribution.find();
  const payWinnersRes = await payWinners.find();
  const payBeneficiaryRes = await payBeneficiary.find();
  const refundRes = await refund.find();

  // const logger = new Moralis.Cloud.getLogger();
  // logger.info("---------------------");
  // logger.info(advancedRes[0].attributes.uid);

  // const attribs = test.attributes;
  // test.attributes = Object.assign({ id: attribs.campaignId }, attribs);
  // logger.info(test);

  // return createdRes;

  const campaigns = createdRes.map((createdCamp) => {
    let attribs = createdCamp.attributes;

    // RENAMING, CASTING
    const additionals = {
      id: attribs.campaignId,
      created: attribs.createdAt,
      prize: +attribs.prizeBasisPoints,
      minContributionUsd: attribs.minContributionUSD,
      targetUsd: attribs.targetUSD,
      creatorFee: +attribs.creatorFee,
      numberOfPicks: attribs.winnerPicks,
      createdTxHash: attribs.transaction_hash,
    };

    const campaign = {
      ...attribs,
      ...additionals,
    };

    // STATUS
    const latestStatusUpdate = advancedRes
      .filter((adv) => adv.attributes.uid === campaign.id)
      .map((adv) => ({
        status: adv.attributes.newStatus,
        txHash: adv.attributes.transaction_hash,
      }))
      .sort((a, b) => +a - +b)
      .pop(); // TODO make more efficient
    campaign.status = +latestStatusUpdate.status;

    if (campaign.status === 2) {
      campaign.concludedSuccessTxHash = latestStatusUpdate.txHash;
    } else if (campaign.status === 3) {
      campaign.receivedRandomnessTxHash = latestStatusUpdate.txHash;
    }

    // CONTRIBUTIONS TOTAL
    // TODO make more efficient with custom query, let DB find the maximum since there may be many entries
    const sortedCampContribs = contributionRes
      .filter((contrib) => contrib.attributes.campaignId === campaign.id)
      .map((contrib) => ({
        amount: contrib.attributes.totalCollected,
        counter: contrib.attributes.counter,
      }))
      .sort((a, b) => +a.counter - +b.counter);
    if (sortedCampContribs.length) {
      campaign.totalCollected = sortedCampContribs.pop().amount;
    }

    // LOTTERY RESULTS
    const lotteryResult = payWinnersRes.find(
      (pw) => pw.attributes.campaignId === campaign.id
    );
    if (lotteryResult) {
      campaign.prizePaidOut = lotteryResult.attributes.amount;
      campaign.winner1 = lotteryResult.attributes.winner1;
      campaign.winner2 = lotteryResult.attributes.winner2;
      campaign.winner3 = lotteryResult.attributes.winner3;
      campaign.lotteryTxHash = lotteryResult.attributes.transaction_hash;
      campaign.winnersPayTxHash = lotteryResult.attributes.transaction_hash;
      campaign.creatorPayTxHash = lotteryResult.attributes.transaction_hash;
    }

    // BENEFICIARY PAY
    const benPay = payBeneficiaryRes.find(
      (pb) => pb.attributes.campaignId === campaign.id
    );
    if (benPay) {
      campaign.benPaidOut = benPay.attributes.amount;
      campaign.benPayTxHash = benPay.attributes.transaction_hash;
    }

    // REFUND
    const refundEvt = refundRes.find(
      (r) => r.attributes.campaignId === campaign.id
    );
    if (refundEvt) {
      campaign.refundsDate = refundEvt.attributes.block_timestamp;
      campaign.refunsTxHash = refundEvt.attributes.transaction_hash;
    }

    return campaign;
  });

  // ---------- ASK CONTRACTS: campaign Address, campaign total collected amount, campaign link balance

  // ---------- ADDRESSES
  const addressesPromises = campaigns.map((c) =>
    Moralis.Cloud.run("campaignAddress", {
      id: c.id,
    })
  );
  const addresses = await Promise.all(addressesPromises);
  campaigns.forEach((c, idx) => {
    c.address = addresses[idx];
  });

  // -------- TOTAL COLLECTED amounts
  const totalCollectedAmountsPromises = campaigns.map((c) =>
    Moralis.Cloud.run("totalCollected", {
      campaignAddress: c.address,
    })
  );
  const totalCollectedAmounts = await Promise.all(
    totalCollectedAmountsPromises
  );
  campaigns.forEach((c, idx) => {
    c.totalCollected = totalCollectedAmounts[idx];
  });

  // TODO --------- LINK BALANCE

  // APPLY

  return campaigns;
});
