import Campaign from "attra-core/campaign.model";

const now = new Date();
const hourNow = now.getHours();
const minuteNow = now.getMinutes();
const dayNow = now.getDate();

const timestamps = new Array(7)
  .fill(null)
  .map((el) => new Date(), new Date(), new Date());

timestamps[6].setMinutes(minuteNow - 5);
timestamps[5].setMinutes(minuteNow - 10);
timestamps[4].setMinutes(minuteNow - 20);
timestamps[3].setHours(hourNow - 1);
timestamps[2].setHours(hourNow - 2);
timestamps[1].setDate(dayNow - 1);
timestamps[0].setDate(dayNow - 2);

const createds = timestamps.map((t, idx) => ({
  created: t,
  address: "0xE95D9628b4Aac9FD2F1fd898Fab8C7a048dEA44d",
  id: timestamps.length - idx - 1,
  createdTxHash:
    "0x2c9c9cf0f28a3e132d88e43020d0bc7c340d9ddebfa813767bfc97846d587d85",
}));

const detailedDummyCampaignsData = [
  {
    ...createds[0],
    status: 6,
    started: createds[0].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 1,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${0}`,
    tokenSymbol: `TX${0}`,
    totalCollected: 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[1],
    status: 5,
    started: createds[1].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 2,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${1}`,
    tokenSymbol: `TX${1}`,
    totalCollected: 800 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[2],
    status: 4,
    started: createds[2].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 3,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${2}`,
    tokenSymbol: `TX${2}`,
    totalCollected: 800 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[3],
    status: 3,
    started: createds[3].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 1,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${3}`,
    tokenSymbol: `TX${3}`,
    totalCollected: 800 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[4],
    status: 2,
    started: createds[4].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 1,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${4}`,
    tokenSymbol: `TX${4}`,
    totalCollected: 800 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[5],
    status: 1,
    started: createds[5].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 2,
    targetUsd: 800,
    minContributionUsd: 100,
    tokenName: `Token${5}`,
    tokenSymbol: `TX${5}`,
    totalCollected: 800 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
  {
    ...createds[6],
    status: 1,
    started: createds[6].created,
    name: `Moneygrab ${(1000 * Math.random()).toFixed(2)} Test`,
    duration: 10000,
    beneficiary: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
    prize: 1000,
    creatorFee: 100,
    numberOfPicks: 3,
    targetUsd: 300800,
    minContributionUsd: 100,
    tokenName: `Token${6}`,
    tokenSymbol: `TX${6}`,
    totalCollected: 250400 + Math.random() * 300,
    linkBalance: 0,
    isAutomated: false,
    creator: "0x281f0d74Fa356C17E36603995e0f50D298d4a5A9",
  },
];

const detailedDummyCampaigns = detailedDummyCampaignsData.map((d) =>
  Campaign.fromObj(d)
);

export { createds as dummyCreatedCampaigns, detailedDummyCampaigns };
