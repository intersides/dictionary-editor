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
    this.$selectedDomain = null;
    this.$intendedRangeValue = null;

    this.aliases = [];
    this.ensureValidation = false;
    this.formIsValid = false;
    this.$submtBtn = false;

    this.validationMessage = null;
    this.$messageContainer = null;

    this.setEventsDelegation();
  }

  attached(){
    this.$messageContainer = jQuery(".application-messages > span");

    this.$submtBtn = $("#addBtn");
    this.$submtBtn.attr("disabled", "disabled");

    this.$selectedDomain = jQuery("#selectedDomain");
    this.$intendedRangeValue = jQuery("#intendedRangeValue");
    this.$selectedDomain.on('keyup', (e)=>{
      this.keypressInput(e);
    });
    this.$intendedRangeValue.on('keyup', (e)=>{
      this.keypressInput(e);
    });

  }

  keypressInput(){
    let formDomainVal = this.$selectedDomain.val().trim();
    let formRangeVal = this.$intendedRangeValue.val().trim();

    let formDomainIsValid = formDomainVal !== null && formDomainVal !== "";
    let formRangeIsValid = formRangeVal !== null && formRangeVal !== "";
    this.formIsValid = formDomainIsValid && formRangeIsValid;

    if(this.formIsValid === true){
      this.$submtBtn.removeAttr("disabled");
    }
    else{
      this.$submtBtn.attr("disabled", "disabled");
    }
  }

  flashItems(items, _state){

    items.forEach((item)=>{

      //identify the item
      for(let colorAliasEntry of this.aliases){
        //console.log(colorAliasEntry, item);
        if(colorAliasEntry.domain.toLowerCase() === item.domain.toLowerCase() && colorAliasEntry.range.toLowerCase() === item.range.toLowerCase() ){
          colorAliasEntry.blinkFor(_state);
        }
      }

    });
  }

  flashItemsBasedOnDomain(items, _state){

    items.forEach((item)=>{
      //identify the item
      for(let colorAliasEntry of this.aliases){
        if(colorAliasEntry.domain.toLowerCase() === item.domain.toLowerCase()){
          colorAliasEntry.blinkFor(_state);
        }
      }

    });
  }


  flashItemsBasedOnRange(items, _state){

    items.forEach((item)=>{
      //identify the item
      for(let colorAliasEntry of this.aliases){
        if(colorAliasEntry.domain.toLowerCase() === item.range.toLowerCase()){
          colorAliasEntry.blinkFor(_state);
        }
      }

    });
  }

  flashItemsBasedOnReversRange(items, _state){

    items.forEach((item)=>{
      //identify the item
      for(let colorAliasEntry of this.aliases){

        if(colorAliasEntry.range.toLowerCase() === item.domain.toLowerCase()){
          colorAliasEntry.blinkFor(_state);
        }
      }

    });
  }

  setEventsDelegation(){

    this.ea.subscribe("onSetColorPressed", (color)=>{
      this.selectedDomain = color;
    });

    this.ea.subscribe("onColorAliasesReceived", (data)=>{
      this.fillAliasesList(data['colorAliases']);
      if( (data['result'] instanceof Array) &&  data['result'].length > 0){
        this.flashItems(data['result'], "feedback");
      }
    });

    this.ea.subscribe("onDictionaryError", (errorData)=>{
      this.processError(errorData);
    });

  }

  processError(errorData){

    let isDictionaryError = function(error){
      if(typeof error.type !== "undefined"){

        if(error.type === "DICTIONARY_ERROR"){
          return true;
        }
      }
      return false;
    };

    let recursiveFindDictionaryError = function(error){

      if(typeof error.type !== "undefined"){

        if(error.type === "DICTIONARY_ERROR"){
          return error;
        }
        else if(error.type === "CLIENT_ERROR"){
          for(let _error of error["stackErrors"]){
            let insideError = recursiveFindDictionaryError(_error);
            if(isDictionaryError(insideError)){
              return insideError;
            }
          }
        }
      }
      return null;
    };

    let dictionaryError = recursiveFindDictionaryError(errorData);
    if(dictionaryError !== null){
      this.displayDictionaryError(dictionaryError);
    }
    else{
      //TODO:unexpected error to handle
      console.error("unexpected error to handle:", dictionaryError);
    }

  }

  displayMessage(_message){
    this.$messageContainer.hide();
    this.validationMessage = _message;
    this.$messageContainer.fadeIn(()=>{});

    setTimeout(()=>{
      this.$messageContainer.fadeOut(()=>{
        this.validationMessage = null;
      });
    }, 4000);
  }

  displayDictionaryError(_dictionaryError){

    //special filter type
    switch(_dictionaryError.code){
      case "DUPLICATE_FAIL":{
        this.flashItemsBasedOnDomain(_dictionaryError.data, "error");
      }break;

      case "CHAIN_FAIL":{
        this.flashItemsBasedOnReversRange(_dictionaryError.data, "error");
      }break;

      case "CYCLE_FAIL":{
        this.flashItemsBasedOnRange(_dictionaryError.data, "error");
      }break;

      default:{

      }break;
    }


    if(_dictionaryError['data'].length > 0){
      this.flashItems(_dictionaryError['data'], "error");
    }
    this.displayMessage(_dictionaryError['message']);
  }

  fillAliasesList(colorList){
    //reset list
    this.aliases = [];
    Object.keys(colorList).forEach((color, idx)=>{
      let colorAliasEntry = new ColorAliasEntry(color, colorList[color]);
      this.aliases.push(colorAliasEntry);
    });
    this.ea.publish("onAliasesListRebuilt", this.aliases);
  }

  cleanUpForm(){
    this.selectedDomain = this.selectedDomain.trim();
    this.intendedRangeValue = this.intendedRangeValue.trim();
    //this.displayMessage("TODO");
  }

  //RestApi requests
  addAlias(){
    //send to server.
    this.cleanUpForm();

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
