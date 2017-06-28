/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

let {ErrorType, ErrorCode} = require('./Error');
let {ClientError} = require('./ClientError');
let {DictionaryError} = require('./DictionaryError');

class Client{
    constructor(_name){

        this.name = null;

        if(typeof _name === "string"){
            this.name = _name.trim();
        }

        /** @type {Dictionary[]} */
        this.dictionaries = [];
    }

    getDictionaries(){
        return this.dictionaries;
    }

    /**
     *
     * @param _dictionaryName
     * @returns {Dictionary | null}
     */
    getDictionary(_dictionaryName){
        for(let dictionary of this.dictionaries){
            if(dictionary.getId() === _dictionaryName.trim()){
                return dictionary;
            }
        }
        return null;
    }

    /**
     * remove range set from the domain/range dictionary
     * @param _aliasValue
     * @param _dictionaryName
     * @return {boolean}
     */
    removeAliasFromDictionary(_aliasValue, _dictionaryName){
        let result = false;
        let dictionary = this.getDictionary(_dictionaryName);
        if(dictionary){
            result = dictionary.removeRange(_aliasValue);
        }
        return result;
    }

	/**
	 *
	 * @param _entryObj
	 * @param _dictionaryName
	 * @return {ClientError | object }
	 */
	addEntryToDictionary(_entryObj, _dictionaryName){

	    let dictionary = this.getDictionary(_dictionaryName);
	    if(dictionary){

            let result = dictionary.addEntry(_entryObj);

            if(result instanceof DictionaryError){
            	let clientError = new ClientError({
					message:"Could not add entry to dictionary",
		            details:"A detailed error has been appended."
	            });
	            clientError.stackErrors.push(result);

	            return clientError;


            }else{
                return result;
            }

	    }
	    else{
	    	return new ClientError({
			    message:`Client has no dictionary named ${_dictionaryName}`,
			    details:`Method Client.addEntryToDictionary was called with a dictionary name that do not correspond to existing dictionaries`
	    	})
	    }

    }

	removeEntryFromDictionary(_entryObj, _dictionaryName){

		let dictionary = this.getDictionary(_dictionaryName);
		if(dictionary){

			let result = dictionary.removeEntry(_entryObj);

			if(result instanceof DictionaryError){
				let clientError = new ClientError({
					message:"Could not remove entry from dictionary",
					details:"A detailed error has been appended."
				});
				clientError.stackErrors.push(result);
				return clientError;

			}else{
				return result;
			}

		}
		else{
			return new ClientError({
				message:`Client has no dictionary named ${_dictionaryName}`,
				details:`Method Client.addEntryToDictionary was called with a dictionary name that do not correspond to existing dictionaries`
			})
		}
	}



    /**
     *
     * @param {string} in_originalDomainValue
     * @param {string} in_updatedDomainValue
     * @param {string} in_dictionaryName
     * @return {boolean | null}
     */
    updateDomainInDictionary(in_originalDomainValue, in_updatedDomainValue, in_dictionaryName){
        let result = new ClientError({
	        message:"Could not update domain",
	        details:"No specified reasons."
        });

        let dictionary = this.getDictionary(in_dictionaryName);
        if(dictionary){
            let duplicateResult = dictionary.updateDomain(in_originalDomainValue, in_updatedDomainValue);
            if(duplicateResult instanceof DictionaryError){
	            result.stackErrors.push(duplicateResult);
            }
            else{
				return duplicateResult;
            }
        }
        else{
	        result = new ClientError({
		        message:"Could not update domain value because the dictionary could not be found",
		        details:"Check attached error for more information."
	        });
	        result.stackErrors.push(new DictionaryError({
		        message:"Could not update domain value because the dictionary could not be found",
				code:ErrorCode.DICTIONARY_NOT_FOUND
	        }));
        }
        return result;
    }

    updateRangeInDictionary(in_originalRangeValue, in_updatedRangeValue, in_dictionaryName){
	    let result = false;
        let dictionary = this.getDictionary(in_dictionaryName);
        if(dictionary){
	        result = dictionary.updateRange(in_originalRangeValue, in_updatedRangeValue);
        }
        return result;
    }

    /**
     *
     * @param {Dictionary} _dictionary
     */
    addDictionary(_dictionary){
        //TODO: validate parameter
        this.dictionaries.push(_dictionary);
    }

    removeDictionary(_dicId){

        let indexToRemove = null;
        for(let i = 0; i < this.dictionaries.length; i++){
            let dic = this.dictionaries[i];
            if(dic.getId() === _dicId.trim()){
                indexToRemove = i;
            }
        }

        if(indexToRemove !== null){
            this.dictionaries.splice(indexToRemove, 1);
        }

    }
}

module.exports = {
    Client:Client
};