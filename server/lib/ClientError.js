/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

let {Error, ErrorType, ErrorCode} = require('./Error');

ErrorType.CLIENT_ERROR = "CLIENT_ERROR";

class ClientError extends Error{
    constructor(_params){
        super(_params);

	    let params = {
		    type : ErrorType.CLIENT_ERROR,
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
	ClientError:ClientError
};