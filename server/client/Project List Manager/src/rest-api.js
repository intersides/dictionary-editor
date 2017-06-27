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


  sendDomainRange(data){
    jQuery.ajax({
      url:"addDomainRanege",
      method:"POST",
      data:data,
      success:(response)=>{
        this.ea.publish("ProductsReceived", response);
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
