import { c2 } from "helpers/formatters";

class Campaign {
  static fromObj = (obj) => {
    return new Campaign(
      obj.address,
      obj.created,
      obj.id,
      obj.status,
      obj.name,
      obj.duration,
      obj.creator,
      obj.beneficiary,
      obj.prize,
      obj.creatorFee,
      obj.numberOfPicks,
      obj.targetUsd,
      obj.minContributionUsd,
      obj.tokenName,
      obj.tokenSymbol,
      obj.totalCollected,
      obj.linkBalance,
      obj.isAutomated,
      obj.winner1,
      obj.winner2,
      obj.winner3,
      obj.prizePaidOut,
      obj.benPaidOut,
      obj.refundsDate
    );
  };

  constructor(
    address,
    created,
    id,
    status,
    name,
    duration,
    creator,
    beneficiary,
    prize,
    creatorFee,
    numberOfPicks,
    targetUsd,
    minContributionUsd,
    tokenName,
    tokenSymbol,
    totalCollected,
    linkBalance,
    isAutomated,
    winner1,
    winner2,
    winner3,
    prizePaidOut,
    benPaidOut,
    refundsDate
  ) {
    this.address = address;
    this.created = created;
    this.id = id;
    this.status = status;
    this.name = name;
    this.duration = duration;
    this.creator = creator;
    this.beneficiary = beneficiary;
    this.prize = prize;
    this.creatorFee = creatorFee;
    this.numberOfPicks = numberOfPicks;
    this.targetUsd = targetUsd;
    this.minContributionUsd = minContributionUsd;
    this.tokenName = tokenName;
    this.tokenSymbol = tokenSymbol;
    this.totalCollected = totalCollected;
    this.linkBalance = linkBalance;
    this.isAutomated = isAutomated;
    this.winner1 = winner1;
    this.winner2 = winner2;
    this.winner3 = winner3;
    this.prizePaidOut = prizePaidOut;
    this.benPaidOut = benPaidOut;
    this.refundsDate = refundsDate;
  }

  estimateWin(amount) {
    const ret = {
      "1_1": {
        chance: amount / this.targetUsd,
        prize: ((this.targetUsd - amount) * this.prize) / 10000,
      },
      "1_2": {
        chance: (amount / this.targetUsd) * 2,
        prize: ((this.targetUsd - amount) * this.prize) / 10000 / 2,
      },
      "1_3": {
        chance: (amount / this.targetUsd) * 3,
        prize: ((this.targetUsd - amount) * this.prize) / 10000 / 3,
      },
      "2_2": {
        chance: (amount / this.targetUsd) ** 2,
        prize: ((this.targetUsd - amount) * this.prize) / 10000,
      },
      "3_3": {
        chance: (amount / this.targetUsd) ** 3,
        prize: ((this.targetUsd - amount) * this.prize) / 10000,
      },
      "2_3": {
        chance: (amount / this.targetUsd) ** 2,
        prize: ((((this.targetUsd - amount) * this.prize) / 10000) * 2) / 3,
      },
    };

    Object.keys(ret).forEach((k) => {
      ret[k] = {
        chance: (ret[k].chance * 100).toFixed(2) + "%",
        prize: c2.format(ret[k].prize),
      };
    });

    return ret;
  }

  get isSettling() {
    return this.status > 1 && this.status < 5;
  }

  hasExpired(now = new Date()) {
    return this.timeLeftMs(now) <= 0;
  }

  ellapsedMs(now = new Date()) {
    return now - this.created; // milliseconds
  }

  get durationMs() {
    return this.duration * 1000; // converted to milliseconds
  }

  timeLeftMs(now = new Date()) {
    return this.durationMs - this.ellapsedMs(now); // milliseconds
  }
}

export default Campaign;
