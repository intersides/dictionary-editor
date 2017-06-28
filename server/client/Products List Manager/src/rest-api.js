/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

import jQuery from "jquery";
import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)
export class RestApi {

  constructor(ea){
    this.ea = ea;
  }

  getProducts(){

    jQuery.ajax({
      url:"products",
      method:"POST",
      success:(response)=>{
        console.log(response);
        this.manageError(response);
        this.ea.publish("ProductsReceived", response);
      },
      error:(error)=>{
        this.manageError({ajaxError:error});
      }

    });

  }

  addDomainRange(data){
    jQuery.ajax({
      url:"addDomainRange",
      method:"POST",
      data:data,
      success:(response)=>{
        console.log(response);
        this.manageError(response);
        if(response.colorAliases){
          this.ea.publish("onColorAliasesReceived", response);
        }
      },
      error:(error)=>{
        this.manageError({ajaxError:error});
      }

    });
  }

  removeDomainRange(data){
    jQuery.ajax({
      url:"removeDomainRange",
      method:"POST",
      data:data,
      success:(response)=>{
        console.log(response);
        this.manageError(response);
        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        this.manageError({ajaxError:error});
      }

    });
  }

  editDomainRange(data) {
    jQuery.ajax({
      url:"editDomainRange",
      method:"POST",
      data:data,
      success:(response)=>{
        console.log(response);
        this.manageError(response);
        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        this.manageError({ajaxError:error});
      }

    });
};

  getColorAliases(){

    jQuery.ajax({
      url:"colorAliases",
      success:(response)=>{
        this.manageError(response);
        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        this.manageError({ajaxError:error});
      }

    });

  }

  manageError(response){

    if(typeof response.result !== "undefined"){
      if(typeof response.result.type === "string"){
        if(response.result.type === "CLIENT_ERROR" || response.result.type === "DICTIONARY_ERROR"){
          this.ea.publish("onDictionaryError", response.result);
        }
      }
    }
    else if(typeof response.ajaxError !== "undefined"){
      //NOTE: must deal with different kind of error
      console.error("unhandled ajax error", response);
    }

  }


}
