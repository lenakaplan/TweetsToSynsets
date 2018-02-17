const synsets = require("../synsets");
const assert = require("assert");

describe("Synonyms", function () {
    describe("Get leader", function () {
        it("digit", async function () {
            let leader = await synsets.getLeader("1");
            assert.equal(leader, "1")
        });

        it("term with synonym and term is the leader", async function () {
            let leader = await synsets.getLeader("apple");
            assert.equal(leader, "apple")
        });

        it("term with synonym and term is not the leader", async function () {
            let leader = await synsets.getLeader("malus pumila");
            assert.equal(leader, "apple")
        });
    });
});