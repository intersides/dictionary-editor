/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

//let logger = require('../common/utilities')().logger;

class Dictionary{

    constructor() {
        this.domainRangeMap = {};
        this.indexMap = {};
    }

    static uniqueValue(a, b){
        return (Math.max(a, b)*(Math.max(a, b) + 1))/2 + Math.min(a, b);
    }

    valueExists(in_value){
        return typeof  this.indexMap[in_value] !== "undefined";
    }

    /**
     * return last created index, which is also the list length
     * @returns {number}
     */
    rebuildIndexMap(){
        let index = 0;
        Object.keys(this.indexMap).forEach((colorName, idx)=>{
            index =idx+1;
            this.indexMap[colorName] = index;
        });
        return index;
    }


    /**
     * Takes one or more value and assigns it to the index map
     * It also recreate the index map each time. Finally it return the length
     * @param {string, string, ...} valueList
     * @returns {Number} last index which is also the maps length
     */
    addValue(valueList){

        let values = Array.from(arguments);

        values.forEach((_value)=>{
            let value = _value.trim();
            if(!this.valueExists(value)){
                this.indexMap[value] = {};
            }
        });

        //rebuildIndexMap() return the last inserted index
        return this.rebuildIndexMap();
    }


    /**
     * Checks if a sent integer corresponds to the unique integer value generated by the values index pair
     * @param {number} in_combinationValue
     * @returns {boolean}
     */
    combinationExist(in_combinationValue){

        for(let originalValue in this.domainRangeMap){

            if(this.domainRangeMap.hasOwnProperty(originalValue)){

                let rangeValue = this.domainRangeMap[originalValue];

                let combinationValue = Dictionary.uniqueValue(this.indexMap[originalValue], this.indexMap[rangeValue]);

                if(combinationValue === in_combinationValue){
                    return true;
                }

            }

        }
        return false;

    }

    /**
     * NOTE:consider to remove the value added to the index map that might not be used because never inserted into the domain-range map
     * Taken two values strings, it insert a map of {domain : range} values after consistency has been checked
     * @param in_originalValue
     * @param in_rangeValue
     * @returns {boolean}
     */
    addToDomainRange(in_originalValue, in_rangeValue){

        //to avoid cycles, original values should not be present in range values set
        //this check could be performed after the original value has been previously added to the values index list
        if(typeof this.indexMap[in_originalValue] !== "undefined"){
            //check if exists in alias set
            if(this.domainExists(in_originalValue)){
                return false;
            }
        }

        this.addValue(in_originalValue, in_rangeValue);

        //use unique combined values from index-map to avoid cross-duplicates
        let combinationValue = Dictionary.uniqueValue(this.indexMap[in_originalValue], this.indexMap[in_rangeValue]);
        if(this.combinationExist(combinationValue)){
            return false;
        }

        if(typeof this.domainRangeMap[in_originalValue] === "undefined"){
            this.domainRangeMap[in_originalValue] = in_rangeValue;
            return true;
        }

        return false;
    }


    domainExists(in_domainName){

        for(let domainName in this.domainRangeMap){

            if(this.domainRangeMap.hasOwnProperty(domainName)){

                if(this.domainRangeMap[domainName] === in_domainName){
                    return this.domainRangeMap[domainName];
                }

            }

        }
        return null;
    }

    getRangeFromDomain(in_domainName){
        return this.domainRangeMap[in_domainName] === "undefined" ? null : this.domainRangeMap[in_domainName];
    }

}

module.exports = {
    Dictionary:Dictionary
};

