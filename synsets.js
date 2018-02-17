const WordNet = require('node-wordnet');
let wordnet = new WordNet();

module.exports = {
    getLeader: async function (term) {
        let definitions;
        try {
            definitions = await wordnet.lookupAsync(term);
        }
        catch (e){
            return term;
        }
        let all_synonyms = [].concat.apply([], definitions.map(d => d.synonyms));
        if(all_synonyms.length === 0) {
            return term;
        }
        all_synonyms = all_synonyms.map(s => s.toLowerCase());
        all_synonyms.sort();
        return all_synonyms[0];
    }
};
