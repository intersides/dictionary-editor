/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

let logger = require('../common/utilities')().logger;

//DictionaryManager is a Singleton
let instance = null;
class DictionaryManager{

    constructor() {
        if(!instance){
            instance = this;
        }

        this.defaultLang = "en-US";

        this.aliasMap = {};
        this.colors = {};


        return instance;
    }


    uniqueValue(a, b){
        return (Math.max(a, b)*(Math.max(a, b) + 1))/2 + Math.min(a, b);
    }

    colorExists(in_color){
        return typeof  this.colors[in_color] !== "undefined";
    }

    resetColorsMap(){
        Object.keys(this.colors).forEach((colorName, idx)=>{
            this.colors[colorName] = idx+1;
        });
    }


    addColors(){

        let colors = Array.from(arguments);

        colors.forEach((_color)=>{
            let color = _color.trim();
            if(!this.colorExists(color)){
                this.colors[color] = {};
            }
        });

        this.resetColorsMap();

        //return list length
        return Object.keys(this.colors).length;
    }


    combinationExist(in_combinationValue){

        for(let colorName in this.aliasMap){

            if(this.aliasMap.hasOwnProperty(colorName)){

                let originalColor = colorName;
                let aliasColor = this.aliasMap[colorName];

                let combinationValue = this.uniqueValue(this.colors[originalColor], this.colors[aliasColor]);

                if(combinationValue === in_combinationValue){
                    return true;
                }

            }

        }
        return false;

    }


    assignColorAlias(in_originalColor, in_aliasColor){

        //to avoid cycles, original color should not be present in alias color
        //this check could be performed after the color has been previously added to the color index list
        if(typeof this.colors[in_originalColor] !== "undefined"){
            //check if exists in alias set
            if(this.aliasExists(in_originalColor)){
                return false;
            }
        }

        this.addColors(in_originalColor, in_aliasColor);

        //use unique combined values from color indexes to avoid cross-duplicates
        let combinationValue = this.uniqueValue(this.colors[in_originalColor], this.colors[in_aliasColor]);
        if(this.combinationExist(combinationValue)){
            return false;
        }

        if(typeof this.aliasMap[in_originalColor] === "undefined"){
            this.aliasMap[in_originalColor] = in_aliasColor;
            return true;
        }

        return false;
    }


    aliasExists(in_color){

        for(let colorName in this.aliasMap){

            if(this.aliasMap.hasOwnProperty(colorName)){

                if(this.aliasMap[colorName] === in_color){
                    return this.aliasMap[colorName];
                }

            }

        }
        return null;
    }

}

module.exports = {
    DictionaryManager:DictionaryManager
};

