/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';
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



  validate(){
   console.error("TODO");
  }


  //RestApi requests
  addAlias(){
    //send to server.
    let dataToSend = {
      list: 'smartphones',
      value: {
        domain: this.selectedDomain,
        range: this.intendedRangeValue
      }
    };
    this.restApi.addDomainRange(dataToSend);
  }
  removeAlias(_colorAliasEntry){
    let answer = confirm("Do you want to remove this entry ?");
    if(answer){
      //send to server.
      let dataToSend = {
        list: 'smartphones',
        value: {
          domain: _colorAliasEntry.domain,
          range: _colorAliasEntry.range
        }
      };
      this.restApi.removeDomainRange(dataToSend);

    }
  }

  hasChanged(_colorAliasEntry, type, event){
    console.log(type, event.target.dataset.beforechange);

    let oldValue = event.target.dataset.beforechange;

    this.restApi.editDomainRange({
      list: 'smartphones',
      type:type,
      value:{
        new:_colorAliasEntry[type],
        old:oldValue
      }
    });


  }

}

