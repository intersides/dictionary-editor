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
      success:(response)=>{
        this.ea.publish("ProductsReceived", response);
      },
      error:(error)=>{
        console.error(error);
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

        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        console.error(error);
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

        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        console.error(error);
      }

    });
  }



  getColorAliases(){

    jQuery.ajax({
      url:"colorAliases",
      success:(response)=>{
        this.ea.publish("onColorAliasesReceived", response);
      },
      error:(error)=>{
        console.error(error);
      }

    });


  }

}
