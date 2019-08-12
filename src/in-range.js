// @ts-check
const axios = require("axios").default;
const defaultLimits = [180, 80];

const apiPath = "/api/v1/entries/sgv";
const filters = {
  hyper: "find[sgv][$gte]",
  hypo: "find[sgv][$lte]"
};

/**
 * Gets the last Hyper or Hypo recorded in Nightscout
 * @param {string} nsUrl Full url to a nightscout site. eg https://ns.example.com
 * @param {string} filter Use filters.hypo or filters.hyper
 * @param {number} value Limit to use.
 * @returns The first entry higher than 'value' for hypos, or lower than 'value' for hypers
 */
const getEntry = async (nsUrl, filter, value) => {
  const params = {
    count: 1
  };
  params[filter] = value;

  const response = await axios.get(nsUrl + apiPath, {
    headers: { Accept: "application/json" },
    params
  });

  return response.data[0];
};

/**
 * Gets a range object indicating time since last hyper, hypo, and total time in range
 * @param {string} nsUrl Full url to a nightscout site
 * @param {number[]} Hyper/Hypo limits. Default: [180, 80]
 */
const get = async (nsUrl, limits) => {
  if (!limits) {
    limits = defaultLimits;
  }

  const lastHyper = await getEntry(nsUrl, filters.hyper, limits[0]);
  const lastHypo = await getEntry(nsUrl, filters.hypo, limits[1]);
  const now = Date.now();

  const range = {
    lastHyper: {
      timestamp: lastHyper.date,
      value: lastHyper.sgv,
      secondsSince: (now - lastHyper.date) / 1000
    },
    lastHypo: {
      timestamp: lastHypo.date,
      value: lastHypo.sgv,
      secondsSince: (now - lastHypo.date) / 1000
    }
  };

  range.secondsInRange = Math.min(
    range.lastHyper.secondsSince,
    range.lastHypo.secondsSince
  );
  return range;
};

module.exports = {
  get
};
