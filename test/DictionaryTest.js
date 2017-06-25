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

let { DictionaryValidator } = require('../server/lib/DictionaryValidator');

describe("Dictionary class", ()=>{


    describe("initialisation", ()=>{

        it("should initialize with id", ()=>{
            let dictionary = new Dictionary("123");
            expect(dictionary.getId()).to.be.equal("123");
            expect(dictionary._domainRangeMap).to.be.empty;
            expect(dictionary._indexMap).to.be.empty;
        });

    });

    describe("adding and removing domain/ranges sets", ()=>{

        it("should maintain the relation between _domainRangeMap and _indexMap", ()=>{
            let dictionary = new Dictionary();
            dictionary.addToDomainRange("Red Apple", "Red");
            dictionary.addToDomainRange("Blue Noa", "Blu");
            dictionary.addToDomainRange("Lapilazuli", "Blu");
            dictionary.addToDomainRange("Venom", "Black");
            dictionary.addToDomainRange("Widow", "Black");

            expect(dictionary._indexMap).to.have.property("Red Apple");
            expect(dictionary._indexMap).to.have.property("Red");

            expect(dictionary._indexMap).to.have.property("Venom");

            dictionary.removeDomainFromRange("Venom");
            expect(dictionary._indexMap).to.not.have.property("Venom");

            dictionary.removeRange("Black");
            expect(dictionary._indexMap).to.not.have.property("Black");
            expect(dictionary._indexMap).to.not.have.property("Widow");

            //try to add an invalid cross domain range
            let result = dictionary.addToDomainRange("Blue Noa", "Blu");
            expect(result).to.be.false;
            result = dictionary.addToDomainRange("Blu", "Blue Noa");
            expect(result).to.be.false;

        });

    });

    describe("adding values to index map", ()=>{

        it("should assign unique integer to a value", ()=>{
            let dictionary = new Dictionary();

            dictionary._addValueToIndexMap("Red");
            expect(dictionary._indexMap).to.have.property("Red");

            dictionary._addValueToIndexMap("Green");
            expect(dictionary._indexMap).to.have.property("Green");

            dictionary._addValueToIndexMap("Blue");
            expect(dictionary._indexMap).to.have.property("Blue");

        });
    });

});

describe("ColorDictionary class", ()=>{


    it("should init with name", ()=>{
        let cd = new ColorDictionary("my color dictionary");
        let dicId = cd.getId();
        expect(dicId).to.be.equal("my color dictionary");
    });

    it("should produce unique values from two integers", ()=>{
        expect(Dictionary.uniqueValue(2, 5)).to.be.equal(Dictionary.uniqueValue(5, 2));
        expect(Dictionary.uniqueValue(1, 2)).to.be.equal(Dictionary.uniqueValue(2, 1));
    });

    

    it("should get range value from domain", ()=>{
        let colorDictionary = new ColorDictionary();
        let success = colorDictionary.addColorAlias("Domain Value", "Range Value");
        expect(success).to.be.true;
        let rangeValue = colorDictionary.getRangeFromDomain("Domain Value");
        expect(rangeValue).to.be.equal("Range Value");

    });


    it("should map a color to an alias uniquely (no duplicates) ", ()=>{
        let colorDictionary = new ColorDictionary();
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
        let colorDictionary = new ColorDictionary();
        let success = colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        expect(success).to.be.true;

        success = colorDictionary.addColorAlias("Dark Grey", "Stonegrey");
        expect(success).to.be.false;
    });

    it("should ensure that alias colors do not appear in domain name columns (no Chains)", ()=>{
        let colorDictionary = new ColorDictionary();
        colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        colorDictionary.addColorAlias("Midnight Black", "Black");
        colorDictionary.addColorAlias("Strong Coffee", "Black");
        colorDictionary.addColorAlias("Mystic Silver", "Silver");

        //inserting a chain
        let success = colorDictionary.addColorAlias("Dark Grey", "Anthracite");
        expect(success).to.be.false;

        console.log("---------------colors----------------");
        console.log(JSON.stringify(colorDictionary._indexMap, null, '\t'), "\n");
        console.log("--------------aliasMap--------------");
        console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");
    });


});

describe("Dictionary Validator", ()=>{

    it("should not find chains", ()=>{

        let dictionary = new Dictionary();
        dictionary.forceToDomainRange("a", "A");
        dictionary.forceToDomainRange("b", "B");
        dictionary.forceToDomainRange("c", "C");

        let hasChains = DictionaryValidator.hasChains(dictionary);
        expect(hasChains).to.be.false;

    });

    it("should find chains", ()=>{

        let dictionary = new Dictionary();
        dictionary.forceToDomainRange("a", "A");
        dictionary.forceToDomainRange("A", "B");
        dictionary.forceToDomainRange("c", "C");

        let hasChains = DictionaryValidator.hasChains(dictionary);
        expect(hasChains).to.be.true;

    });

    it("should not find cycles", ()=>{

        let dictionary = new Dictionary();
        dictionary.forceToDomainRange("a", "A");
        dictionary.forceToDomainRange("b", "B");
        dictionary.forceToDomainRange("c", "C");

        let cycles = DictionaryValidator.getCycles(dictionary);
        console.log(cycles);
        expect(cycles).length(0);


        let hasCycles = DictionaryValidator.hasCycles(dictionary);
        expect(hasCycles).to.be.false;

    });

    it("should find cycles", ()=>{

        let dictionary = new Dictionary();
        dictionary.forceToDomainRange("a", "A");
        dictionary.forceToDomainRange("A", "a");
        dictionary.forceToDomainRange("c", "C");
        dictionary.forceToDomainRange("ca", "C");
        dictionary.forceToDomainRange("ab", "A");
        dictionary.forceToDomainRange("C", "c");

        let cycles = DictionaryValidator.getCycles(dictionary);
        //console.log(cycles);
        expect(cycles).length(2);


        let hasChains = DictionaryValidator.hasCycles(dictionary);
        expect(hasChains).to.be.true;

    });


});