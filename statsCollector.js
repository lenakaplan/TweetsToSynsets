const synsets = require("./synsets");

function tokenizeWords(tweet) {
    return tweet.split(' ');
}


module.exports = {
    getTweetStats: async function (tweet) {
        let stats = new Map();
        let tokens = tokenizeWords(tweet);
        for (let token of tokens) {
            token = token.toLowerCase();
            let leader = await synsets.getLeader(token);
            if (!stats.has(leader)){
                stats.set(leader, new Map());

            }
            if (!stats.get(leader).has(token)) {
                stats.get(leader).set(token, 0);
            }

            stats.get(leader).set(token, stats.get(leader).get(token) + 1);
        }

        return stats;
    }
};