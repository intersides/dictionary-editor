/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

let logger = require('../common/utilities')().logger;


class ProductDisplay{
    constructor(){
        this.productSets = {};
        this.filters = {};
    }

    /**
     *
     * @param {ProductList} productSet
     */
    addSet(productSet){
        this.productSets[productSet.getType()] = productSet;
    }

    getAllProducts(){
        let allProducts = [];
        for(let setType in this.productSets){
            allProducts = allProducts.concat(this.productSets[setType].getProducts());
        }
        return allProducts;
    }

    addFilter(in_propertyToFilter, in_dictionarySet){

        this.filters[in_propertyToFilter] = in_dictionarySet;
    }

    getProductsFromSet(_params){

        let params = {
            selector:null,
            setType:null,
            transformed:false
        };

        //set params from _params
        if(typeof _params === "object" && _params !== null){
            Object.keys(params).forEach((key)=>{
                if(typeof _params[key] !== "undefined"){
                    params[key] = _params[key];
                }
            });
        }

        let productsMap = null;
        let products = [];
        /** @type ProductList */
        if(params.setType){
            productsMap = this.productSets[params.setType];
            products = productsMap.getProducts();
        }
        else{
            //all
            products = this.getAllProducts();
        }

        if(params.selector){
            //filter content based on selector
            let filteredProducts = [];

            for(let product of products){
                let found = true;
                Object.keys(params.selector).forEach((prop)=>{
                    //console.log(prop, selector[prop]);
                    if(product[prop] !== params.selector[prop]){
                        found = false;
                    }
                });
                if(found){
                    filteredProducts.push(product);
                }
            }
            products = filteredProducts;
        }

        //transform customizable properties
        if(params.transformed){
            products.forEach((product)=>{
                this.applyTransformationToProduct(product, this.filters);
            });
        }

        return products;
    }


    applyTransformationToProduct(product, filters){

        Object.keys(filters).forEach((filter_key)=>{

            if(typeof product.clientProperties[filter_key] !== "undefined"){

                /** @type Dictionary */
                let dictionary = filters[filter_key];
                let rangeValue = dictionary.getRangeFromDomain(product[filter_key]);
                if(rangeValue){
                    product.clientProperties[filter_key] = rangeValue;
                }
            }
        });

    }
}

module.exports = {
    ProductDisplay:ProductDisplay
};