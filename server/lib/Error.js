/**
 * Created by marcofalsitta on 27.06.17.
 * InterSides.net
 *
 */

let ErrorType = {
	GENERIC_ERROR:"GENERIC_ERROR"
};

let ErrorCode = {
	UNDEFINED:"UNDEFINED"
};

class Error{
	constructor(_params){

		let params = {
			type : ErrorType.GENERIC_ERROR,
			code:ErrorCode.UNDEFINED,
			message : null,
			details : null,
			data:[]
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
		this.code = params.code;
		this.message = params.message;
		this.details = params.details;
		this.data = params.data;
		this.stackErrors = [];
	}

}

module.exports = {
	Error:Error,
	ErrorType:ErrorType,
	ErrorCode:ErrorCode
};