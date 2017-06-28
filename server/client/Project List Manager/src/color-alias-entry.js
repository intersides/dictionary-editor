/**
 * Created by marcofalsitta on 27.06.17.
 * InterSides.net
 *
 */

export class ColorAliasEntry{

  constructor(_domain, _range, RestApi){
    this.domain = _domain !== "undefined" ? _domain : null;
    this.range = _range !== "undefined" ? _range : null;

    this.valid = true;
    this.isChecked = false;
  }

  getDomain(){
    return this.domain;
  }
  getRange(){
    return this.range;
  }

  editMode(evt, value){
    this.isChecked = !this.isChecked;
    console.log("in edit mode:", this.isChecked)
  }

  setValid(_flag){
    this.valid = _flag;
  }

}
