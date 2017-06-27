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
    let data = {
      domain:this.selectedDomain,
      range:this.intendedRangeValue
    };
    console.warn("sending....", data);
    this.restApi.sendDomainRange(data);

    return;

    let colorAliasEntry = new ColorAliasEntry(this.selectedDomain, this.intendedRangeValue);

    this.aliases.push(colorAliasEntry);
    this.selectedDomain = null;
    this.intendedRangeValue = null;
    this.validate();
  }

  validate(){

    //let colorDictionary = new ColorDictionary();
    //this.aliases.forEach((colorAliasEntry)=>{
    //  colorAliasEntry.valid = true;
    //  console.log(colorAliasEntry);
    //  colorDictionary.addColorAlias(colorAliasEntry.domain, colorAliasEntry.range, this.ensureValidation);
    //});
    //
    //let result = DictionaryValidator.findIssues(colorDictionary);
    //console.warn(result);
    //if(result.cycles.length){
    //  console.log("cycles", result.cycles);
    //}
    //
    //if(result.chains.length > 0){
    //  result.chains.forEach((chain)=>{
    //    console.log("chain", chain);
    //    //find item
    //    this.aliases.forEach((colorAliasEntry)=>{
    //      console.log(colorAliasEntry);
    //      let domain = Object.keys(chain)[0];
    //      let range = chain[domain];
    //
    //      if(colorAliasEntry.domain === domain && colorAliasEntry.range === range){
    //        colorAliasEntry.valid = false;
    //      }
    //    });
    //  });
    //
    //}

    //send to server.
    this.restApi.sendDomainRange({
      domain:this.selectedDomain,
      range:this.intendedRangeValue
    })



  }

  removeAlias(_colorAliasEntry){

    let itemToRemove = null;
    this.aliases.forEach((colorAliasEntry, idx)=>{
      if(colorAliasEntry.domain === _colorAliasEntry.domain && colorAliasEntry.range === _colorAliasEntry.range){
        console.log("remove", idx);
        itemToRemove = idx;
      }
    });

    if(itemToRemove){
      this.aliases.splice(itemToRemove, 1);
    }

    this.validate();

  }

}

