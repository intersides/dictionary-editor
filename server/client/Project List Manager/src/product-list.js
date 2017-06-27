/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */

import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';


@inject(EventAggregator)
export class ProductList{

  constructor(EventAggregator){

    this.products = [];
    this.selectedId = null;

    this.ea = EventAggregator;

    this.setEventsDelegation();

  }

  setEventsDelegation(){
    this.ea.subscribe("ProductsReceived", (data)=>{
      this._listToProducts(data);
    });

    this.ea.subscribe("onColorAliasesReceived", (data)=>{
      console.log("onColorAliasesReceived", data);
    });

  }

  _listToProducts(data){
    console.log("***");
    console.log(data);

    if(typeof data['products'] === "object" && data['products'] !== null){

      if(typeof data['products']['sPhones'] === "object" && data['products']['sPhones'].constructor === Array){

        console.log("received phones", data['products']['sPhones']);

        data['products']['sPhones'].forEach((phone)=>{
          this.products.push(phone);
        });

      }

    }

    else{
      console.error("received data does not contains valid products", data);
    }
  }

  created(){}

  editColor(_color){
    console.log("****", _color);
    this.ea.publish("onSetColorPressed", _color);

  }

  select(product) {
    //this.selectedId = product.id;
    return true;
  }

}
