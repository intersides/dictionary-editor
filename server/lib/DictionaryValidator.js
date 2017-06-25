/**
 * Created by marcofalsitta on 25.06.17.
 * InterSides.net
 *
 */

let { Dictionary } = require("./Dictionary");

class DictionaryValidator{

    /**
     * Allow to produce unique value from two integers . Used for Xross reference between Domains/Ranges validation
     * @param a
     * @param b
     * @return {number}
     */
    static uniqueValue(a, b){
        return (Math.max(a, b)*(Math.max(a, b) + 1))/2 + Math.min(a, b);
    }


    /**
     *check that a value in Rang does not appear in Domain
     * @param {Dictionary} in_dictionary
     * @return Array
     */
    static findChains(in_dictionary){

        let isPresent = function(_chain, _chains){
            for(let chain of _chains){
                if(JSON.stringify(chain) === JSON.stringify(_chain)){
                    return true;
                }
            }
            return false;
        };

        let ranges = in_dictionary.getRanges();
        let entries = in_dictionary.getEntries();
        let chains = [];

        for(let range of ranges){

            Object.keys(entries).forEach((domain)=>{

                if(domain === range){
                    let row = {};
                    row[domain] = entries[domain];
                    //chains[range] = row;

                    if(!isPresent(row, chains)){
                        chains.push(row);
                    }
                }

            });

        }

        return chains;
    }

    static hasChains(in_dictionary){
        return this.findChains(in_dictionary).length !== 0;
    }

    static hasCycles(in_dictionary){
        return this.findCycles(in_dictionary).length > 0;
    }

    static findCycles(in_dictionary){

        let domains = in_dictionary.getDomains();
        let entriesCopy = JSON.parse(JSON.stringify(in_dictionary.getEntries())) ;

        let indexMap = this._buildIndexMap(in_dictionary);

        let cycleRows = [];
        domains.forEach((domain)=>{
            let range = entriesCopy[domain];

            let combinedId = this.uniqueValue(indexMap[domain], indexMap[range]);

            //remove previous check
            delete entriesCopy[domain];

            let cycles = this.searchForCycles(combinedId, entriesCopy, indexMap);
            //console.log(cycles);
            if(cycles !== null){
                cycleRows.push(cycles);
            }

        });

        return cycleRows;

    }

    static searchForCycles(in_combinedId, _entries, indexMap){

        for(let domain in _entries){
            if(_entries.hasOwnProperty(domain)){
                let range = _entries[domain];
                let combinedId = this.uniqueValue(indexMap[domain], indexMap[range]);
                if(combinedId === in_combinedId){
                    let cycleRow = {};
                    cycleRow[domain] = range;
                    return cycleRow;
                }
            }

        }

        return null;
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

    static findIssues(dictionary){

        let cycles = this.findCycles(dictionary);
        let chains = this.findChains(dictionary);

        return {
            cycles:cycles,
            chains:chains
        }

    }

    static fixIssues(dictionary){
        let cycles = this.removeCycles(dictionary);
        let chains = this.removeChains(dictionary);
        return {
            cycles:cycles,
            chains:chains
        };
    }

    //TODO: consider to only run validate for Chains... if cycles might imply that we have chains
    static willInvalidateDictionary(_domain, _range, _dictionary){
        return !!(this.willChain(_domain, _range, _dictionary) || this.willCycle(_domain, _range, _dictionary));
    }

    static willCycle(_domain, _range, _dictionary){

        if(_dictionary.getDomains().indexOf(_range) !== -1){
            //_Range is in domains
            let domain = _dictionary.getRangeFromDomain(_range);
            if(domain === _domain){
                return true;
            }
        }

        return false;

    };

    /**
     * If the passed domain is part or ranges or if the intended range is part of domain, it will fail.
     * @param _domain
     * @param _range
     * @param _dictionary
     * @return {boolean}
     */
    static willChain(_domain, _range, _dictionary){
        //console.log("*", _range, _dictionary.getRanges().indexOf(_domain) !== -1);
        return _dictionary.getDomains().indexOf(_range) !== -1 || _dictionary.getRanges().indexOf(_domain) !== -1;
    };

    static removeCycles(dictionary){
        let removedCycles = [];
        this._removeCycles(dictionary, removedCycles);
        return removedCycles;
    }

    static _removeCycles(dictionary, trashCan, reverse=false){
        let cycles = this.findCycles(dictionary);
        //console.log(cycles);

        if(cycles.length > 0){
            let cycle = cycles[0];
            if(reverse){
                cycle = cycles.pop();
            }
            let domain = Object.keys(cycle)[0];
            //console.info("about to remove domain %s", domain);
            dictionary.removeDomainFromRange(domain);

            trashCan.push(cycle);

            this._removeCycles(dictionary, trashCan, reverse);
        }

    }


    static removeChains(dictionary, reversed=false){
        let removedChain = []; //closure trashCan
        this._removeChains(dictionary, removedChain, reversed);
        return removedChain;
    }


    static _removeChains(dictionary, trashCan, reverse=false){
        let chains = this.findChains(dictionary);

        if(chains.length > 0){
            let chain = chains[0];
            if(reverse){
                chain = chains.pop();
            }
            let domain = Object.keys(chain)[0];
            //console.info("about to remove domain %s", domain);
            dictionary.removeDomainFromRange(domain);

            trashCan.push(chain);

            this._removeChains(dictionary,trashCan, reverse);
        }

    }
}

module.exports = {
    DictionaryValidator:DictionaryValidator
};