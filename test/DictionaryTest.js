/**
 * Created by marcofalsitta on 23.06.17.
 * InterSides.net
 *
 */
"use strict";

let assert = require('chai').assert;
let expect = require('chai').expect;
let should = require('chai').should();

let { Dictionary } = require('../server/lib/Dictionary');
let { ColorDictionary } = require('../server/lib/ColorDictionary');


describe("ColorDictionary class", ()=>{

    let colorDictionary = new ColorDictionary();

    it("should produce unique values from two integers", ()=>{
        expect(Dictionary.uniqueValue(2, 5)).to.be.equal(Dictionary.uniqueValue(5, 2));
        expect(Dictionary.uniqueValue(1, 2)).to.be.equal(Dictionary.uniqueValue(2, 1));
    });

    it("should assign unique integer to a color", ()=>{

        let lastIndex = colorDictionary.addColor("Red");
        expect(lastIndex).to.be.equal(1);

        lastIndex = colorDictionary.addColor("Red");
        expect(lastIndex).to.be.equal(1);

        lastIndex = colorDictionary.addColor("Green");
        expect(lastIndex).to.be.equal(2);

        lastIndex = colorDictionary.addColor("Blue");
        expect(lastIndex).to.be.equal(3);

    });

    it("should get range value from original original", ()=>{
        let success = colorDictionary.addColorAlias("Original Value", "Range Value");
        expect(success).to.be.true;
        let rangeValue = colorDictionary.getRangeFromDomain("Original Value");
        expect(rangeValue).to.be.equal("Range Value");

    });


    it("should map a color to an alias uniquely (no duplicates) ", ()=>{
        let success = colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.true;
        success = colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.false;

        success = colorDictionary.addColorAlias("Midnight Blue", "Darker Bluish");
        expect(success).to.be.false;

        success = colorDictionary.addColorAlias("Intense Blue", "Dark Blue");
        expect(success).to.be.true;
    });

    it("should ensure unique values combination (no Cycles)", ()=>{
        let success = colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        expect(success).to.be.true;

        success = colorDictionary.addColorAlias("Dark Grey", "Stonegrey");
        expect(success).to.be.false;
    });

    it("should ensure that alias colors do not appear in original name columns (no Chains)", ()=>{
        let success = colorDictionary.addColorAlias("Dark Grey", "Anthracite");
        expect(success).to.be.false;
    });




    describe("log final structure", ()=>{
        it("should log", ()=>{
            console.log("---------------colors----------------");
            console.log(JSON.stringify(colorDictionary.indexMap, null, '\t'), "\n");
            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary.domainRangeMap, null, '\t'), "\n");
        });
    });


});