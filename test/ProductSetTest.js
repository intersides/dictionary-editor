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

let { Dictionary } = require('../server/lib/Dictionary');




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


let dM = new Dictionary("colors");

describe("ProductSet class", ()=>{

    it("should produce unique values from two integers", ()=>{
    });


    describe("log final structure", ()=>{
        it("should log", ()=>{
            console.log("---------------colors----------------");
            console.log(JSON.stringify(dM.indexMap, null, '\t'), "\n");
            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(dM.domainRangeMap, null, '\t'), "\n");
        });
    });


});