const inRange = require("../src/in-range");
let testUrl;

try {
  testUrl = require("./testUrl");
  if (!testUrl) throw "no url";
} catch (e) {
  throw new Error("To test, replace the URL in testUrl.js.example".toUpperCase());
}

const chai = require("chai");
const expect = chai.expect;

describe("In Range", () => {
  it("gets the last Hyper", async () => {
    const range = await inRange.get(testUrl);
    expect(range.lastHyper.timestamp).to.be.a("number");
    expect(range.lastHyper.value).to.be.greaterThan(179);
  });

  it("gets the last Hypo", async () => {
    const range = await inRange.get(testUrl);
    expect(range.lastHypo.timestamp).to.be.a("number");
    expect(range.lastHypo.value).to.be.lessThan(81);
  });

  it("get time since last Hyper/Hypo", async () => {
    const range = await inRange.get(testUrl);
    expect(range.lastHyper.secondsSince).to.be.a("number");
    expect(range.lastHypo.secondsSince).to.be.a("number");
  });

  it("returns sane values", async () => {
    const range = await inRange.get(testUrl);

    // Hyper should be 180 - 500
    expect(range.lastHyper.value).to.be.below(500);
    expect(range.lastHyper.value).to.be.above(180);

    // Hypo should be 20 - 80
    expect(range.lastHypo.value).to.be.below(80);
    expect(range.lastHypo.value).to.be.above(20);

    // Both values should have occurred within 5 days
    const _5daysInSeconds = 5 * 24 * 60 * 60;
    expect(range.lastHyper.secondsSince).to.be.below(_5daysInSeconds);
    expect(range.lastHypo.secondsSince).to.be.below(_5daysInSeconds);
  });

  it("gets seconds in Range", async () => {
    const range = await inRange.get(testUrl);

    expect(range.secondsInRange).to.be.a("number");

    expect(range.secondsInRange).to.be.oneOf([
      range.lastHyper.secondsSince,
      range.lastHypo.secondsSince
    ]);
  });

  it("respects custom limits", async () => {
    const customLimits = [300, 50];
    const range = await inRange.get(testUrl, customLimits);

    expect(range.lastHyper.value).to.be.above(customLimits[0]);
    expect(range.lastHypo.value).to.be.below(customLimits[1]);
  });
});
