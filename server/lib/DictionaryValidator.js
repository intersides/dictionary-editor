/**
 * Created by marcofalsitta on 25.06.17.
 * InterSides.net
 *
 */

let { Dictionary } = require("./Dictionary");

class DictionaryValidator{


    /**
     *check that a value in Rang does not appear in Domain
     * @param {Dictionary} in_dictionary
     */
    static findChains(in_dictionary){

        let domains = in_dictionary.getDomains();
        let ranges = in_dictionary.getRanges();

        let chains = {};

        for(let range of ranges){
            //console.log(range, domains);
            let foundAt = domains.indexOf(range);
            if(foundAt !== -1){
                //console.log("found %s", foundAt);
                if(typeof chains[range] === "undefined"){
                    chains[range] = []
                }
                chains[range].push(foundAt);
            }
        }

        return Object.keys(chains).length === 0 ? null : chains;
    }

    static hasChains(in_dictionary){
        return this.findChains(in_dictionary) !== null;
    }

    static hasCycles(in_dictionary){
        return this.getCycles(in_dictionary).length > 0;
    }

    static getCycles(in_dictionary){

        let domains = in_dictionary.getDomains();
        let entriesCopy = JSON.parse(JSON.stringify(in_dictionary.getEntries())) ;

        let indexMap = this._buildIndexMap(in_dictionary);

        let cycleRows = [];
        domains.forEach((domain)=>{
            let range = entriesCopy[domain];

            let combinedId = Dictionary.uniqueValue(indexMap[domain], indexMap[range]);

            //remove previous check
            delete entriesCopy[domain];

            let cycles = this.searchForCycles(combinedId, entriesCopy, indexMap);
            if(cycles.length > 0){
                cycleRows.push(cycles);
            }
        });

        return cycleRows;

    }

    static searchForCycles(in_combinedId, _entries, indexMap){

        let cyclesRows = [];
        let domains = Object.keys(_entries);
        domains.forEach((domain)=>{
            let range = _entries[domain];
            let combinedId = Dictionary.uniqueValue(indexMap[domain], indexMap[range]);
            if(combinedId === in_combinedId){
                let cycleRow = {};
                cycleRow[domain] = range;
                cyclesRows.push(cycleRow);
            }
        });

        return cyclesRows;
    }



    static _buildIndexMap(in_dictionary){

        //extract all the Domains and Ranges values first.
        let domains = in_dictionary.getDomains();
        let ranges = [];
        domains.forEach( (domain)=>{
            ranges.push(in_dictionary._domainRangeMap[domain]);
        });

        let domainANDRanges = domains.concat(ranges);

        //always rebuild the index map
        let indexMap = {};
        domainANDRanges.forEach((colorName, idx)=>{
            indexMap[colorName] = idx+1;
        });

        return indexMap;
    }
}

module.exports = {
    DictionaryValidator:DictionaryValidator
};