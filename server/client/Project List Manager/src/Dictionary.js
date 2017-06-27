/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

//let logger = require('../common/utilities')().logger;

let {DictionaryValidator} = require("./DictionaryValidator");

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

    }

    getEntries(){
        return this._domainRangeMap;
    }

    getEntriesCount(){
        return this.getDomains().length;
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
     * remove the key/map specified in the parameter and then rebuild the index map
     * @param _domainName
     * @return {boolean} removal result
     */
    removeDomainFromRange(_domainName){

        if(this._domainRangeMap[_domainName] !== "undefined"){
            delete this._domainRangeMap[_domainName];
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

        let willInvalidate = DictionaryValidator.willInvalidateDictionary(null, in_newValue, this);
        if(willInvalidate === true){
            return false;
        }

        let updatedRows = 0;
        this.getDomains().forEach((domain)=>{
            if(this._domainRangeMap[domain] === in_originalVale){
                //console.info("**found ", domain, in_originalVale);
                this._domainRangeMap[domain] = in_newValue;
                updatedRows++;
            }
        });

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

    addToDomainRange(in_domainValue, in_rangeValue, in_validateFirst=true){

        if(in_validateFirst === true){
            if(DictionaryValidator.willInvalidateDictionary(in_domainValue, in_rangeValue, this)){
                return false;
            }
        }

        //another validation ?
        if(typeof this._domainRangeMap[in_domainValue] === "undefined"){
            this._domainRangeMap[in_domainValue] = in_rangeValue;
            return true;
        }
        return false;

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

