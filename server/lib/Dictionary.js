/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

//let logger = require('../common/utilities')().logger;

let {DictionaryValidator} = require("./DictionaryValidator");
let {ValidationError} = require('./ValidationError');
let {DictionaryError} = require('./DictionaryError');
let {ErrorCode} = require('./Error');

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

	/**
     * Take json doctionary of string:string to set the current domainRangeMap
	 * @param _jsonDictionary
	 */
	setFromJSON(_jsonDictionary){
        //TODO:validate the passed parameter
		this._domainRangeMap = _jsonDictionary;
    }

	/**
	 *
	 * @param domainRangeEntry
	 * entitySpec = {
			domain:"Some original value",
			range:"Alias to be applied"

		};
	 */
	addEntry(domainRangeEntry){
		//TODO:validate entry object

		let response = DictionaryValidator.entryExists(domainRangeEntry, this);

		if(response.constructor === ValidationError){

			let dictionaryError = new DictionaryError({
				message:"An invalidation error has been triggered. Check the attached error"
			});
			dictionaryError.stackErrors.push(response);
			return dictionaryError;
		}
		else if(response === false){

			//validate for cycle
			let willCycle = DictionaryValidator.willCycle(domainRangeEntry.domain, domainRangeEntry.range, this);
			let willChain = DictionaryValidator.willChain(domainRangeEntry.domain, domainRangeEntry.range, this);
			if(willCycle === true){
				return new DictionaryError({
					code:ErrorCode.CYCLE_FAIL,
					message:"Failed adding entry to dictionary. It is a cycle.",
					details:"Cycles: Two or more rows in a dictionary result in cycles, resulting in a never-ending transformation."
				});
			}
			else if(willChain === true){
				return new DictionaryError({
					code:ErrorCode.CHAIN_FAIL,
					message:"Failed adding entry to dictionary. It is a chain.",
					details:"Chains: A chain structure in the dictionary (a value in Range column also appears in Domain column of another entry), resulting in inconsistent transformation."
				});
			}
			else{
				//all seems to be fine
				return this._addToDomainRange(domainRangeEntry.domain, domainRangeEntry.range);
			}

		}
		else{
			return new DictionaryError({
				message:"Failed adding entry to dictionary. The key already exists.",
				detail:'Duplicate Domains with different Ranges: Two rows in the dictionary map to different values, resulting in an ambiguous transformation',
				code:ErrorCode.DUPLICATE_FAIL
			});
		}

    }

	/**
	 *
	 * @param domainRangeEntry
	 * @return { DictionaryError | boolean }
	 */
	removeEntry(domainRangeEntry){

	    let response = DictionaryValidator.entryExists(domainRangeEntry, this);
	    if(response.constructor === ValidationError){

		    let dictionaryError = new DictionaryError({
			    message:"An invalidation error has been triggered. Check the attached error"
		    });
		    dictionaryError.stackErrors.push(response);
		    return dictionaryError;
	    }
	    else if(response === true){
		    let removealResult = this.removeDomainFromRange(domainRangeEntry['domain']);
		    return removealResult;
	    }
	    else{
		    return new DictionaryError({
			    message:"Failed removing entry to dictionary. Item was not found."
		    });
	    }

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

    	//need to cycle because lowercase need to be enforced
	    for(let domain in this._domainRangeMap){
	    	if(this._domainRangeMap.hasOwnProperty(domain)){
	    		if(domain.toLowerCase() === _domainName.toLowerCase()){
				    delete this._domainRangeMap[domain];
				    return true;
			    }
		    }
	    }
	    return false;
    };

    /**
     * Add a new entry in the domain/range using the existing range value,  removes the previous one.
     * Should fails if the updated value already exists
     * @param in_originalVale
     * @param in_newValue
     * @return {*}
     */
    updateDomain(in_originalVale, in_newValue){

        if(this._domainRangeMap[in_originalVale] !== "undefined"){

	        let rangeValue = this._domainRangeMap[in_originalVale];

	        let willIvalidate = DictionaryValidator.willInvalidateDictionary(in_newValue, rangeValue, this);
            if(willIvalidate === false){

            	delete this._domainRangeMap[in_originalVale];

            	let result = this.addEntry({domain:in_newValue, range:rangeValue});
            	if(result instanceof DictionaryError === false){
            		return {domain:in_newValue, range:rangeValue};
	            }
            }
            else{

	            let error = new DictionaryError({
		            message:"Could not update domain value because the dictionary will be invalid",
	            });

            	if(DictionaryValidator.willDuplicate(in_newValue, rangeValue, this)){
					error.code = ErrorCode.DUPLICATE_FAIL;
	            }
	            else if(DictionaryValidator.willChain(in_newValue, rangeValue, this)){
		            error.code = ErrorCode.CHAIN_FAIL;
	            }
	            else if(DictionaryValidator.willCycle(in_newValue, rangeValue, this)){
		            error.code = ErrorCode.CYCLE_FAIL;
	            }

	            return error;

            }

        }
        else{
	        return new DictionaryError({
		        message:"Could not update domain value because the domain to modified was not found"
	        });

        }

	    return new DictionaryError({
		    message:"Could not update domain value because the dictionary could not be found",
		    code:ErrorCode.DICTIONARY_NOT_FOUND
	    });

    }


    /**
     * Change all ranges from old_vale to new_value as long as it will not create a chain. (new value already present in domain)
     * @param in_originalVale
     * @param in_newValue
     * @return {boolean}
     */
    updateRange(in_originalVale, in_newValue){

	    if(this.getDomains().indexOf(in_newValue) !== -1){
	    	//there are domains with this intended value. exit operaiton
            return new DictionaryError({
	            message:"Cannot update range. The value already exists as domain.",
	            code:ErrorCode.CHAIN_FAIL
            });
	    }
	    else{

		    let updatedRows = [];
		    this.getDomains().forEach((domain)=>{
			    if(this._domainRangeMap[domain] === in_originalVale){
				    //console.info("**found ", domain, in_originalVale);
				    this._domainRangeMap[domain] = in_newValue;
				    updatedRows.push({domain:domain, range:in_newValue});
			    }
		    });

		    return updatedRows;
	    }


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
	 * only check if domain is found not
	 * @param in_domainValue
	 * @param in_rangeValue
	 * @return {*}
	 * @private
	 */
	_addToDomainRange(in_domainValue, in_rangeValue){

		//cycling because lowercase transformation need to be checked
		for(let domain in this._domainRangeMap){

			if(this._domainRangeMap.hasOwnProperty(domain)){

				if(domain.toLowerCase() === in_domainValue.toLowerCase()){

					return new DictionaryError({
						message:"Failed adding entry to dictionary. The key already exists.",
						details:"Duplicate Domains with different Ranges: Two rows in the dictionary map to different values, resulting in an ambiguous transformation.",
						code:ErrorCode.DUPLICATE_FAIL
					});

				}
			}
		}

		//ELSE .. no domain duplicate found
		this._domainRangeMap[in_domainValue] = in_rangeValue;

		let insertedEntity = {};
		insertedEntity[in_domainValue] = in_rangeValue;
		return insertedEntity;

	}

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

