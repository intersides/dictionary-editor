/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

//let logger = require('../common/utilities')().logger;

class Dictionary{

    /**
     *
     * @param _id
     */
    constructor(_id) {
        /**
         * @type {string|number}
         * @private
         */
        this._id = _id;

        /**
         * @type {object}
         * @private
         */
        this._domainRangeMap = {};

        /**
         * keep a reference between integer values and any Domain or Range value
         * added. This allow x-reference identifications
         * @type {object}
         * @private
         */
        this._indexMap = {};
    }

    static uniqueValue(a, b){
        return (Math.max(a, b)*(Math.max(a, b) + 1))/2 + Math.min(a, b);
    }

    getEntries(){
        return this._domainRangeMap;
    }


    /**
     * get all domains in domains/range set
     * @return {Array}
     */
    getDomains(){
        return Object.keys(this._domainRangeMap);
    }

    getRanges(){
        let ranges = [];
        this.getDomains().forEach((domain)=>{
            ranges.push(this._domainRangeMap[domain]);
        });
        return ranges;
    }

    setId(_id){
        this._id = _id;
    }

    getId(){
        return this._id;
    }

    /**
     *
     * @param in_value
     * @returns {boolean}
     * @private
     */
    _valueExists(in_value){
        return typeof  this._indexMap[in_value] !== "undefined";
    }

    /**
     * return last created index, which is also the list length
     * @returns {number}
     * @private
     */
    _rebuildIndexMap2(){

        //extract all the Domains and Ranges values first.
        let domains = this.getDomains();
        let ranges = [];
        domains.forEach((domain)=>{
            ranges.push(this._domainRangeMap[domain]);
        });

        let domainANDRanges = domains.concat(ranges);

        //always rebuild the index map
        this._indexMap = {};
        domainANDRanges.forEach((colorName, idx)=>{
            this._indexMap[colorName] = idx+1;
        });
    }


    /**
     * Takes one or more value and assigns it to the index map
     * It also recreate the index map each time. Finally it return the length
     * @param {string, string, ...} valueList
     * @private
     */
    _addValueToIndexMap(valueList){

        let values = Array.from(arguments);

        values.forEach((_value)=>{
            let value = _value.trim();
            if(!this._valueExists(value)){
                this._indexMap[value] = {};
            }
        });

    }


    /**
     * Checks if a sent integer corresponds to the unique integer value generated by the values index pair
     * @param {number} in_combinationValue
     * @returns {boolean}
     */
    combinationExist(in_combinationValue){

        for(let domainValue in this._domainRangeMap){

            if(this._domainRangeMap.hasOwnProperty(domainValue)){

                let rangeValue = this._domainRangeMap[domainValue];

                let combinationValue = Dictionary.uniqueValue(this._indexMap[domainValue], this._indexMap[rangeValue]);

                if(combinationValue === in_combinationValue){
                    return true;
                }

            }

        }
        return false;

    }

    /**
     * remove the key/map specified in the parameter and then rebuild the index map
     * @param _domainName
     * @return {boolean} removal result
     */
    removeDomainFromRange(_domainName){
        if(this._domainRangeMap[_domainName] !== "undefined"){
            delete this._domainRangeMap[_domainName];
            this._rebuildIndexMap2();
            return true;
        }
        return false;
    };

    /**
     * Add a new entry in the domain/range using the existing range value,  removes the previous one.
     * _rebuildIndexMap2 is not called because addToDomainRange() calls it already
     * Should fails if the updated value already exists
     * @param in_originalVale
     * @param in_newValue
     * @return {*}
     */
    updateDomain(in_originalVale, in_newValue){
        if(this._domainRangeMap[in_originalVale] !== "undefined"){
            let rangeValue = this._domainRangeMap[in_originalVale];
            if(this.addToDomainRange(in_newValue, rangeValue)){
                delete this._domainRangeMap[in_originalVale];
                return true;
            }
        }
        return false;
    }


    /**
     *
     * @param in_originalVale
     * @param in_newValue
     * @return {boolean}
     */
    updateRange(in_originalVale, in_newValue){
        let updatedRows = 0;
        this.getDomains().forEach((domain)=>{
            if(this._domainRangeMap[domain] === in_originalVale){

                console.info("**found ", domain, in_originalVale);

                //some swapping need to be done
                //- 1 copy the found set into a temporary area
                //- 2 remove the found set
                //- 3 try to add a new domain/range entry
                //-4a if it succeed discard the temporary saved value (or leave it as it is)
                //-4b if fails place back the temporary pair

                //1 //TODO:might not be necessary
                //let tmpPair = {};
                //tmpPair[domain] = this._domainRangeMap[domain]; //JSON.parse(JSON.stringify());

                //2
                //delete this._domainRangeMap[domain];
                this.removeDomainFromRange(domain);
                //console.info("DD ", tmpPair);

                //3
                let result = this.addToDomainRange(domain, in_newValue);
                console.info("++added ", domain, in_newValue, result);
                if(result){
                    //4a
                    //tmpPair = null;
                    //delete this._domainRangeMap[domain];
                    updatedRows++;
                }
                else{
                    //4b
                    let result = this.addToDomainRange(domain, in_originalVale);

                }

                //this._domainRangeMap[domain] = in_newValue;

            }
        });

        //this._rebuildIndexMap2();

        return updatedRows > 0;
    }


    /**
     * Take out all the entries that are using the same range name
     * indexMap is rebuilt from the removeDomainRange call
     * @param _rangeName
     * @return {boolean} operation result
     */
    removeRange(_rangeName){

        let wasSuccess = false;
        this.getDomains().forEach((domain)=>{
            if(this._domainRangeMap[domain] === _rangeName){
                wasSuccess = this.removeDomainFromRange(domain);
            }
        });
        return wasSuccess;
    }

    /**
     * NOTE:consider to remove the value added to the index map that might not be used because never inserted into the domain-range map
     * Taken two values strings, it insert a map of {domain : range} values after consistency has been checked
     * @param in_originalValue
     * @param in_rangeValue
     * @returns {boolean}
     * @private
     */
    _addToDomainRange(in_originalValue, in_rangeValue){

        //to avoid cycles, original values should not be present in range values set
        //this check could be performed after the original value has been previously added to the values index list
        if(typeof this._indexMap[in_originalValue] !== "undefined"){
            //check if exists in alias set

            //console.log(this.getDomain(in_originalValue));

            if(this.getDomain(in_originalValue) !== null){
                return false;
            }
        }

        this._addValueToIndexMap(in_originalValue, in_rangeValue);

        //use unique combined values from index-map to avoid cross-duplicates
        let combinationValue = Dictionary.uniqueValue(this._indexMap[in_originalValue], this._indexMap[in_rangeValue]);
        if(this.combinationExist(combinationValue)){
            return false;
        }

        if(typeof this._domainRangeMap[in_originalValue] === "undefined"){
            this._domainRangeMap[in_originalValue] = in_rangeValue;
            return true;
        }

        return false;
    }

    addToDomainRange(in_originalValue, in_rangeValue){
        let result = this._addToDomainRange(in_originalValue, in_rangeValue);
        this._rebuildIndexMap2();
        return result;
    };

    forceToDomainRange(in_domainValue, in_rangeValue){
        this._domainRangeMap[in_domainValue] = in_rangeValue;
        this._rebuildIndexMap2();
    };

    domainIsPresent(in_domainName){
        return typeof this._domainRangeMap[in_domainName] !== "undefined";
    }

    getDomain(in_domainName){

        for(let domainName in this._domainRangeMap){

            if(this._domainRangeMap.hasOwnProperty(domainName)){

                if(this._domainRangeMap[domainName] === in_domainName){
                    return this._domainRangeMap[domainName];
                }

            }

        }

        return null;
    }

    /**
     * get the string value of the range associated to a domain
     * if the domain is missing return null
     * @param {string} in_domainValue
     * @return {string|null}
     */
    getRangeFromDomain(in_domainValue){
        let rangeValue = this._domainRangeMap[in_domainValue];
        if(typeof  rangeValue === "undefined"){
            return null;
        }
        return rangeValue;
    }

    /**
     *
     * @param _rangeName
     * @return {boolean}
     */
    hasRange(_rangeName){

        for(let domain of this.getDomains()){
            if(this._domainRangeMap[domain] === _rangeName){
                return true;
            }
        }
        return false;
    }

    /**
     * just a friendly name for range
     * @param _rangeName
     * @return {boolean}
     */
    hasAlias(_rangeName){
        return this.hasRange(_rangeName);
    }


}

module.exports = {
    Dictionary:Dictionary
};

