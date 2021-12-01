export const n6 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
});
export const n4 = new Intl.NumberFormat("en-us", {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 4,
});

export const c2 = new Intl.NumberFormat("en-us", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
  }
  return "";
};

export const tokenValue = (value, decimals) =>
  decimals ? value / Math.pow(10, decimals) : value;

/**
 * Return a formatted string with the symbol at the end
 * @param {number} value integer value
 * @param {number} decimals number of decimals
 * @param {string} symbol token symbol
 * @returns {string}
 */
export const tokenValueTxt = (value, decimals, symbol) =>
  `${n4.format(tokenValue(value, decimals))} ${symbol}`;

export const readableStatus = (status) => {
  switch (status) {
    case 0:
      return "Not started yet.";
    case 1:
      return "Collecting Contributions";
    case 2:
      return "Preparing lottery";
    case 3:
      return "Ready for lottery";
    case 4:
      return "Winners settled";
    case 5:
      return "Winners & beneficiary settled";
    case 6:
      return "Target not reached, closed";
    default:
      return "Unknown";
  }
};

export const miniStatus = (status) => {
  switch (status) {
    case 0:
      return "Not started yet";
    case 1:
      return "Collecting";
    case 2:
    case 3:
      return "Pre-Lottery";
    case 4:
      return "Winners Settled";
    case 5:
      return "All Settled";
    case 6:
      return "Target not reached, closed";
    default:
      return "Unknown";
  }
};
