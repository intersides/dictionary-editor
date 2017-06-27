/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */


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

	addDomainRangeToDictionary(_domain, _range, _dictionaryName){
        let dictionary = this.getDictionary(_dictionaryName);
		if(dictionary){
			return dictionary.addToDomainRange(_domain, _range);
		}
		return false;

    }

    /**
     * call the dictionary removeDomainFromRange to clear the entry related to
     * a specific domain value
     * @param {string} _domainValue
     * @param {string} _dictionaryName
     * @return {boolean}
     */
    removeDomainFromDictionary(_domainValue, _dictionaryName){
        let result = false;
        let dictionary = this.getDictionary(_dictionaryName);
        if(dictionary){
            result = dictionary.removeDomainFromRange(_domainValue);
        }
        return result;
    }

    /**
     *
     * @param {string} in_originalDomainValue
     * @param {string} in_updatedDomainValue
     * @param {string} in_dictionaryName
     * @return {boolean | null}
     */
    updateDomainInDictionary(in_originalDomainValue, in_updatedDomainValue, in_dictionaryName){
        let out_result = false;
        let dictionary = this.getDictionary(in_dictionaryName);
        if(dictionary){
            out_result = dictionary.updateDomain(in_originalDomainValue, in_updatedDomainValue);
        }
        return out_result;
    }

    updateRangeInDictionary(in_originalRangeValue, in_updatedRangeValue, in_dictionaryName){

        let out_result = false;
        let dictionary = this.getDictionary(in_dictionaryName);
        if(dictionary){
            out_result = dictionary.updateRange(in_originalRangeValue, in_updatedRangeValue);
        }
        return out_result;
    }

    /**
     *
     * @param {Dictionary} _dictionary
     */
    addDictionary(_dictionary){
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