//import jQuery from "jquery";

import {RestApi} from "./rest-api";
import {inject} from 'aurelia-framework';

@inject(RestApi)
export class App {

  constructor(RestApi){
    this.title = "Product List Manager";
    this.restApi = RestApi;
  }

  created() {
    //1 - get the available products
    this.restApi.getProducts();

    //2 - get color aliases
    this.restApi.getColorAliases();
  }



}
