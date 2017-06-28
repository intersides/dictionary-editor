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
    this.feedbackState = '';
  }

  blinkFor(state, seconds=1){

    console.warn("assigning state to feedback", state);

    this.feedbackState = state;

    setTimeout(()=>{
      this.feedbackState = '';
    }, seconds*1000);

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
