/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */

"use strict";


let assert = require('chai').assert;
let expect = require('chai').expect;
let should = require('chai').should();

let logger = require('../server/common/utilities')().logger;

let {DictionaryManager} = require('../server/lib/DictionaryManager');

//
////global constants
//const defaultLang = "en-US";
//
////class definition
//
//let aliasTable = {};
//
//function assignAlias(in_originalColor, in_aliasColor, langId=defaultLang){
//
//    if(typeof aliasTable[in_aliasColor] === "undefined"){
//        aliasTable[in_aliasColor] = [];
//    }
//    else{
//
//        logger.info(getAlias(in_originalColor));
//
//        if(getAlias(in_originalColor)){
//            return false;
//        }
//    }
//
//    aliasTable[in_aliasColor].push(in_originalColor);
//
//    return true;
//
//}
//
//
//function getAlias(in_originalColor){
//    let aliases =  Object.keys(aliasTable);
//
//    for(let i = 0; i < aliases.length; i++){
//
//        let ranges = aliasTable[aliases[i]];
//
//        logger.info(ranges);
//
//        if(ranges.indexOf(in_originalColor) !== -1){
//            return aliases[i];
//        }
//
//    }
//
//    return null;
//}


//mocked data
let originalDataSet = {
    "A1633":{
        name:"iPhone 6s",
        color:"Stonegrey",
        price:"769.00",
        currency:"CHF"
    },
    "G950U":{
        name:"Samsung Galaxy S8",
        color:"Midnight Blue",
        price:"569.00",
        currency:"CHF"
    },
    "HP010":{
        name:"Huawei P 10",
        color:"Mystic Silver",
        price:"27.00",
        currency:"CHF"
    }

};

let desiredDataSet = {
    "A1633":{
        name:"iPhone 6s",
        color:"Dark Grey",
        price:"769.00",
        currency:"CHF"
    },
    "G950U":{
        name:"Samsung Galaxy S8",
        color:"Black",
        price:"569.00",
        currency:"CHF"
    },
    "HP010":{
        name:"Huawei P 10",
        color:"Silver",
        price:"27.00",
        currency:"CHF"
    }

};


let DM = new DictionaryManager();


describe("Range Assignment", ()=>{

    it("should produce unique values from two integers", ()=>{
        expect(DM.uniqueValue(2, 5)).to.be.equal(DM.uniqueValue(5, 2));
        expect(DM.uniqueValue(1, 2)).to.be.equal(DM.uniqueValue(2, 1));
    });

    it("should assign unique integer to a color", ()=>{

        let lastIndex = DM.addColors("Red");
        expect(lastIndex).to.be.equal(1);

        lastIndex = DM.addColors("Red");
        expect(lastIndex).to.be.equal(1);

        lastIndex = DM.addColors("Green");
        expect(lastIndex).to.be.equal(2);

        lastIndex = DM.addColors("Blue");
        expect(lastIndex).to.be.equal(3);

    });

    it("should map a color to an alias uniquely (no duplicates) ", ()=>{
        let success = DM.assignColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.true;
        success = DM.assignColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.false;

        success = DM.assignColorAlias("Midnight Blue", "Darker Bluish");
        expect(success).to.be.false;

        success = DM.assignColorAlias("Intense Blue", "Dark Blue");
        expect(success).to.be.true;
    });


    it("should ensure unique values combination (no Cycles)", ()=>{
        let success = DM.assignColorAlias("Stonegrey", "Dark Grey");
        expect(success).to.be.true;

        success = DM.assignColorAlias("Dark Grey", "Stonegrey");
        expect(success).to.be.false;
    });

    it("should ensure that alias colors do not appear in original name columns (no Chains)", ()=>{
        let success = DM.assignColorAlias("Dark Grey", "Anthracite");
        expect(success).to.be.false;
    });



    describe("log final structure", ()=>{
        it("should log", ()=>{
            console.log("---------------colors----------------");
            console.log(JSON.stringify(DM.colors, null, '\t'), "\n");
            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(DM.aliasMap, null, '\t'), "\n");
        });
    });


});