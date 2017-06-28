/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

let {Error, ErrorType, ErrorCode} = require('./Error');

ErrorType.DICTIONARY_ERROR = "DICTIONARY_ERROR";
//extending error codes
ErrorCode.CYCLE_FAIL = "CYCLE_FAIL";
ErrorCode.CHAIN_FAIL = "CHAIN_FAIL";
ErrorCode.DUPLICATE_FAIL = "DUPLICATE_FAIL";
ErrorCode.DICTIONARY_WILL_BE_INVALIDATED = "DICTIONARY_WILL_BE_INVALIDATED";
ErrorCode.DICTIONARY_NOT_FOUND = "DICTIONARY_NOT_FOUND";

class DictionaryError extends Error{
    constructor(_params){
        super(_params);

	    let params = {
		    type : ErrorType.DICTIONARY_ERROR,
		    message : null,
		    details : null
	    };

	    //assign default values to params from _params
	    if(typeof _params === "object" && _params !== null){
		    Object.keys(params).forEach((key)=>{
			    if(typeof _params[key] !== "undefined"){
				    params[key] = _params[key];
			    }
		    });
	    }

	    this.type = params.type;
	    this.message = params.message;
	    this.details = params.details;

    }

}

module.exports = {
	DictionaryError:DictionaryError
};