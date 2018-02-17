const twetterStream = require('./twitterStream');
const synsets = require('./synsets');
const number = 3;

twetterStream.listenOnStream();

// setInterval(() => {
//     let res = synsets.topNSynsets(number);
// }, 2000);