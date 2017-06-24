/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

class ProductList{

    constructor(type){
        this.type = type;
        this.list = [];
    }

    getType(){
        return this.type;
    }

    getProducts(){
        return this.list;
    }

    addProduct(item){

        //verify that we only consider item classes corresponding to ProductSet type
        if(typeof item !== "object" || item.constructor.name !== this.type){
            return null;
        }
        else{
            this.list.push(item);
            return item;
        }

    }
}


module.exports = {
    ProductList:ProductList
};