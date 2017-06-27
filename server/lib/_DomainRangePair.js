/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

class DomainRangePair{

	constructor(in_domain, in_range){
		this._domain = DomainRangePair._setValue(in_domain);
		this._range = DomainRangePair._setValue(in_range);
	}

	getDomain(){
		return this._domain;
	}

	getRange(){
		return this._range;
	}

	static _setValue(in_str){
		let validatedValue = DomainRangePair._validateParameter(in_str);
		if(!validatedValue){
			return null;
			//throw new Error("passed parameter must be a non empty string");
		}
		else{
			return validatedValue
		}
	}

	static _validateParameter(in_strParam){
		if(typeof in_strParam === "string"){
			return in_strParam.trim();
		}
		return null;
	}

	asJSON(){
		return {domain:this._domain, range:this._range};
	}

}

module.exports = {
	DomainRangePair:DomainRangePair
};