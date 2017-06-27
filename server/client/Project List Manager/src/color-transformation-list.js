/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

let {ColorDictionary} = require('./ColorDictionary');
let {DictionaryValidator} = require('./DictionaryValidator');

import {ColorAliasEntry} from './color-alias-entry';
import {RestApi} from "./rest-api";



@inject(EventAggregator, RestApi)
export class ColorTransformationList{

  constructor(EventAggregator, RestApi){

    this.restApi = RestApi;
    this.ea = EventAggregator;
    this.selectedDomain = null;
    this.intendedRangeValue = null;
    this.aliases = [];
    this.ensureValidation = false;

    this.setEventsDelegation();

  }


  setEventsDelegation(){
    this.ea.subscribe("onSetColorPressed", (color)=>{
      this.selectedDomain = color;
    });

    this.ea.subscribe("onColorAliasesReceived", (data)=>{
      this.fillAliasesList(data['colorAliases']);
    });

  }

  setDomain(){
    console.log("setDomain:", this.selectedDomain);
  }


  fillAliasesList(colorList){

    //reset list
    this.aliases = [];

    Object.keys(colorList).forEach((color, idx)=>{
      //this.aliases.push({domain:color, range:colorList[color]});
      let colorAliasEntry = new ColorAliasEntry(color, colorList[color]);
      //if(idx === 2){
      //  colorAliasEntry.setValid(false);
      //}
      this.aliases.push(colorAliasEntry);
    });
  }

  addAlias(){
    //send to server.
    let dataToSend = {
      type: 'smartphones',
      value: {
        domain: this.selectedDomain,
        range: this.intendedRangeValue
      }
    };
    this.restApi.addDomainRange(dataToSend);
  }

  validate(){
   console.error("TODO");
  }

  removeAlias(_colorAliasEntry){
    //send to server.
    let dataToSend = {
      type: 'smartphones',
      value: {
        domain: _colorAliasEntry.domain,
        range: _colorAliasEntry.range
      }
    };
    this.restApi.removeDomainRange(dataToSend);
  }

}

