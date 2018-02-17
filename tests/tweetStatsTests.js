const tweetStats = require("../statsCollector");
const assert = require("assert");

describe("Stats", function () {
    describe("Collect", function () {
        it("Single token", async function () {
            let stats = await tweetStats.getTweetStats("apple");
            assert.equal(stats.get("apple").get("apple"), 1);
        });
        it("Same token twice", async function () {
            let stats = await tweetStats.getTweetStats("apple apple");
            assert.equal(stats.get("apple").get("apple"), 2);
        });
        it("Token with leader", async function () {
            let stats = await tweetStats.getTweetStats("table");
            assert.equal(stats.get("board").get("table"), 1);
        });
        it("Two tokens", async function () {
            let stats = await tweetStats.getTweetStats("table apple");
            assert.equal(stats.get("board").get("table"), 1);
            assert.equal(stats.get("apple").get("apple"), 1);
        });
    });
});