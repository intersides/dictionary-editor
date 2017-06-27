/**
 * Created by marcofalsitta on 27.06.17.
 * InterSides.net
 *
 */

export class ColorAliasEntry{

  constructor(_domain, _range){
    this.domain = _domain !== "undefined" ? _domain : null;
    this.range = _range !== "undefined" ? _range : null;
    this.valid = true;
  }

  activate(model){
    this.domain = model.domain;
    this.range = model.range;
    this.valid = model.valid;
  }

  setValid(_flag){
    this.valid = _flag;
  }

}
