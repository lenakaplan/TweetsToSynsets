const Twitter = require('twitter');
const statsCollector = require("./statsCollector");
const _ = require("lodash");

const client = new Twitter({
    consumer_key: 'Y7eBDRrsZBXxlEBx4QGQxeekv',
    consumer_secret: 'IDoYq5QASrlanJDaZnZYPSdWQrVoeFlJ0flsW4esVYgXcrOLVQ',
    access_token_key: '2304220138-mL23R9Vjirj4vs9TIu72yhusIYrwgdbVcEJ9esD',
    access_token_secret: 'nwPwOhpsfaketDVK6K1OMZlxiY6Va2ugjFG2NpUZDgZu6'
});

var globalStats = new Map();
var buckets = _.range(30).map(() => new Map());

setInterval(() => {
    let latestBucket = buckets[buckets.length - 1];
    latestBucket.forEach((counts, leader) => {
        if (!globalStats.has(leader)) {
            globalStats.set(leader, new Map());
        }
        counts.forEach((count, token) => {
            if (!globalStats.get(leader).has(token)) {
                globalStats.get(leader).set(token, 0);
            }
            globalStats.get(leader).set(token, globalStats.get(leader).get(token) + count);
        });
    });

    buckets.push(new Map());
    let oldestBucket = buckets.shift();

    for (let [leader, counts] of oldestBucket) {
        for (let [token, count] of counts) {
            globalStats.get(leader).set(token, globalStats.get(leader).get(token) - count);
            if (globalStats.get(leader).get(token) === 0) {
                globalStats.get(leader).delete(token);
                if (globalStats.get(leader).length === 0) {
                    globalStats.delete(leader);
                }
            }
        }
    }
    module.exports.topN(3);
}, 2000);

module.exports = {
    topN(n) {
        let synsetTotal = [];
        for (let [leader, counts] of globalStats) {

            let total = 0;
            counts.forEach((count, word) => {
                total += count;
            });
            synsetTotal.push({
                leader: leader,
                count: total
            });
        }

        synsetTotal.sort((group, other) => {
            return other.count - group.count
        });
        let output = `Top ${n}:\n{`;

        for (let leader of synsetTotal.slice(0, n)) {
            let synsetWords = globalStats.get(leader.leader);
            for (let [token, count] of synsetWords) {
                output+= `{${token}:${count}},`
            }
            output+= ` total: ${leader.count}}`;
        }
        console.log(`${output}`);
    },

    listenOnStream() {
        client.stream('statuses/sample', {language: 'en'}, function (stream) {
            console.log('listening..');
            stream.on('data', async function (tweet) {
                let tweetStats = await statsCollector.getTweetStats(tweet.text);
                let latest_stats = buckets[buckets.length - 1];
                tweetStats.forEach((counts, leader) => {
                    if (!latest_stats.has(leader)) {
                        latest_stats.set(leader, new Map());
                    }
                    counts.forEach((count, token) => {
                        if (!latest_stats.get(leader).has(token)) {
                            latest_stats.get(leader).set(token, 0);
                        }
                        latest_stats.get(leader).set(token, latest_stats.get(leader).get(token) + count);
                    });
                });
            });

            stream.on('error', function (error) {
                console.log(`woops ${error}`);
                stream.destroy();
                process.exit(0);
            });
        });
    }
};