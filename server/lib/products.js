/**
 * Created by marcofalsitta on 24.06.17.
 * InterSides.net
 *
 */

class CustomizableProduct{

    constructor(customizableProperties){
        this.clientProperties = customizableProperties;
    }

}

class Router extends CustomizableProduct{
    constructor(_specs){
        super({
            description:null
        });

        let specs = {
            brand:null,
            model:null,
            name:null,
            version:null,
            productionYear:null,
            serialNumber:null,
            description:null
        };

        //assign default values to specs from _specs
        if(typeof _specs === "object" && _specs !== null){
            Object.keys(specs).forEach((key)=>{
                if(typeof _specs[key] !== "undefined"){
                    specs[key] = _specs[key];
                }
            });
        }

        this.brand = specs.brand;
        this.model = specs.model;
        this.name = specs.name;
        this.version = specs.version;
        this.productionYear = specs.productionYear;
        this.serialNumber = specs.serialNumber;
        this.description = specs.description;

        //set super clientProperties with same specs/defaults
        this.clientProperties.description = this.description;
    }
}

class SmartPhone extends CustomizableProduct{
    constructor(_specs){
        //set which properties can be assigned by client
        super({
            color:null,
            description:null
        });


        let specs = {
            brand:null,
            model:null,
            name:null,
            version:null,
            productionYear:null,
            IMEI:null,
            serialNumber:null,
            description:null,
            color:null
        };

        //assign default values to specs from _specs
        if(typeof _specs === "object" && _specs !== null){
            Object.keys(specs).forEach((key)=>{
                if(typeof _specs[key] !== "undefined"){
                    specs[key] = _specs[key];
                }
            });
        }

        this.brand = specs.brand;
        this.model = specs.model;
        this.name = specs.name;
        this.version = specs.version;
        this.productionYear = specs.productionYear;
        this.IMEI = specs.IMEI;
        this.serialNumber = specs.serialNumber;
        this.color = specs.color;
        this.description = specs.description;

        //set super clientProperties with same specs/defaults
        this.clientProperties.color = this.color;
        this.clientProperties.description = this.description;

    }
}


module.exports = {
    SmartPhone:SmartPhone,
    Router:Router
};