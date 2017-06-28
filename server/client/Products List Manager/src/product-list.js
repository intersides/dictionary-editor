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
      console.log("onColorAliasesReceived... doing nothing with it at the moment", data);
    });

    this.ea.subscribe("onAliasesListRebuilt", (aliasList)=>{
      //should compare the products color with the ranges from the list

      let products = {};

      for(let product of this.products){
        let productColor = product.color;
        //add new property colorAlias
        product['colorAlias'] = null;
        product['hasAlias'] = false;

        for(let  colorAliasEntry of aliasList ){

          let aliasDomain = colorAliasEntry.domain;
          let aliasRange = colorAliasEntry.range;

          if(
            productColor.trim().toLowerCase() === aliasDomain.trim().toLowerCase()
            ||
            productColor.trim().toLowerCase() === aliasRange.trim().toLowerCase()
          ){
            product['colorAlias'] = aliasRange;
            product['hasAlias'] = true;
          }

        }

      }

    });


  }

  _listToProducts(data){

    if(typeof data['products'] === "object" && data['products'] !== null){

      if(typeof data['products']['sPhones'] === "object" && data['products']['sPhones'].constructor === Array){

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
    this.ea.publish("onSetColorPressed", _color);
  }

  select(product) {
    //this.selectedId = product.id;
    return true;
  }

}
