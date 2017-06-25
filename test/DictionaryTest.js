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

        it("should add domain/rang map entry", ()=>{
            let dictionary = new Dictionary();
            dictionary.addToDomainRange("Red Apple", "Red");
            dictionary.addToDomainRange("Blue Noa", "Blu");
            dictionary.addToDomainRange("Lapilazuli", "Blu");
            dictionary.addToDomainRange("Venom", "Black");
            dictionary.addToDomainRange("Widow", "Black");

            expect(dictionary.getRangeFromDomain("Red Apple")).to.be.equal("Red");
            expect(dictionary.getRangeFromDomain("Blue Noa")).to.be.equal("Blu");
            expect(dictionary.getRangeFromDomain("Lapilazuli")).to.be.equal("Blu");
            expect(dictionary.getRangeFromDomain("Venom")).to.be.equal("Black");
            expect(dictionary.getRangeFromDomain("Venom")).to.not.be.equal("Blu");
            expect(dictionary.getRangeFromDomain("Widow")).to.be.equal("Black");

            expect(dictionary.getEntriesCount()).to.be.equal(5);


        });

        it("should remove domain map entry", ()=>{
            let dictionary = new Dictionary();
            dictionary.addToDomainRange("Red Apple", "Red");
            dictionary.addToDomainRange("Blue Noa", "Blu");
            dictionary.addToDomainRange("Lapilazuli", "Blu");
            dictionary.addToDomainRange("Venom", "Black");
            dictionary.addToDomainRange("Widow", "Black");

            dictionary.removeDomainFromRange("Venom");
            expect(dictionary.getRangeFromDomain("Venom")).to.be.null;

            dictionary.removeDomainFromRange("Blue Noa");

            expect(dictionary.getEntriesCount()).to.be.equal(3);

        });

        it("should remove range with associated domains", ()=>{
            let dictionary = new Dictionary();
            dictionary.addToDomainRange("Red Apple", "Red");
            dictionary.addToDomainRange("Blue Noa", "Blu");
            dictionary.addToDomainRange("Lapilazuli", "Blu");
            dictionary.addToDomainRange("Venom", "Black");
            dictionary.addToDomainRange("Widow", "Black");

            dictionary.removeRange("Black");
            expect(dictionary.getEntriesCount()).to.be.equal(3);

            dictionary.removeRange("Black");
            expect(dictionary.getEntriesCount()).to.be.equal(3);

            dictionary.removeRange("Blu");
            expect(dictionary.getEntriesCount()).to.be.equal(1);

        });


    });

    //describe("adding values to index map", ()=>{
    //
    //    it("should assign unique integer to a value", ()=>{
    //        let dictionary = new Dictionary();
    //
    //        dictionary._addValueToIndexMap("Red");
    //        expect(dictionary._indexMap).to.have.property("Red");
    //
    //        dictionary._addValueToIndexMap("Green");
    //        expect(dictionary._indexMap).to.have.property("Green");
    //
    //        dictionary._addValueToIndexMap("Blue");
    //        expect(dictionary._indexMap).to.have.property("Blue");
    //
    //    });
    //});

});

describe("ColorDictionary class", ()=>{


    it("should init with name", ()=>{
        let cd = new ColorDictionary("my color dictionary");
        let dicId = cd.getId();
        expect(dicId).to.be.equal("my color dictionary");
    });

    //it("should produce unique values from two integers", ()=>{
    //    expect(Dictionary.uniqueValue(2, 5)).to.be.equal(Dictionary.uniqueValue(5, 2));
    //    expect(Dictionary.uniqueValue(1, 2)).to.be.equal(Dictionary.uniqueValue(2, 1));
    //});


    it("should get range value from domain", ()=>{
        let colorDictionary = new ColorDictionary();
        let success = colorDictionary.addColorAlias("Domain Value", "Range Value");
        expect(success).to.be.true;
        let rangeValue = colorDictionary.getRangeFromDomain("Domain Value");
        expect(rangeValue).to.be.equal("Range Value");

    });


    it("should map a color to an alias uniquely (no duplicates) ", ()=>{
        let colorDictionary = new ColorDictionary();

        //insert first entry
        let success = colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.true;

        //try to duplicate same first entry (domain and range)
        success = colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");
        expect(success).to.be.false;

        //try to duplicate same first entry (domain only)
        success = colorDictionary.addColorAlias("Midnight Blue", "Darker Bluish");
        expect(success).to.be.false;

        //inserting a new entry with different domain
        success = colorDictionary.addColorAlias("Intense Blue", "Dark Blue");
        expect(success).to.be.true;

        expect(colorDictionary.getEntriesCount()).to.be.equal(2);


    });

    it("should predict if an item to be inserted will create a cycle", ()=>{
        let colorDictionary = new ColorDictionary();
        let success = colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        expect(success).to.be.true;

        //validating before trying to insert {"Dark Grey":"Stonegrey"};

        let willCycle = DictionaryValidator.willCycle("Dark Grey", "Stonegrey", colorDictionary);
        expect(willCycle).to.be.true;

        let willChain = DictionaryValidator.willChain("Dark Grey", "Stonegrey", colorDictionary);
        expect(willChain).to.be.true;

        let willInvalidate = DictionaryValidator.willInvalidateDictionary("Dark Grey", "Stonegrey", colorDictionary);
        expect(willInvalidate).to.be.true;

    });


    it("should ensure unique values combination (no Cycles)", ()=>{
        let colorDictionary = new ColorDictionary();
        let success = colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        expect(success).to.be.true;

        success = colorDictionary.addColorAlias("Dark Grey", "Stonegrey");

        let cycles = DictionaryValidator.findCycles(colorDictionary);
        console.log(cycles);

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
        console.log(success);
        expect(success).to.be.false;

    });


});

describe("Dictionary Validator", ()=>{

    it("should not find chains", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);
        dictionary.addToDomainRange("b", "B", false);
        dictionary.addToDomainRange("c", "C", false);

        let hasChains = DictionaryValidator.hasChains(dictionary);
        expect(hasChains).to.be.false;

    });

    it("should find chains", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);
        dictionary.addToDomainRange("A", "B", false);
        dictionary.addToDomainRange("A", "C", false); //NOTE:this row should not even be inserted
        dictionary.addToDomainRange("c", "C", false);
        dictionary.addToDomainRange("C", "c", false);

        expect(dictionary.getEntriesCount()).to.be.equal(4);

        let chains = DictionaryValidator.findChains(dictionary);
        let expectedChains = [
            {"A":"B"},
            {"C":"c"},
            {"c":"C"}
            ];
        expect(chains).to.be.deep.equal(expectedChains);

        let hasChains = DictionaryValidator.hasChains(dictionary);
        expect(hasChains).to.be.true;

    });

    it("should find chains", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);
        dictionary.addToDomainRange("A", "B", false);
        dictionary.addToDomainRange("A", "C", false); //NOTE:this row should not even be inserted
        dictionary.addToDomainRange("c", "C", false);
        dictionary.addToDomainRange("C", "c", false);

        expect(dictionary.getEntriesCount()).to.be.equal(4);

        let chains = DictionaryValidator.findChains(dictionary);
        let expectedChains = [
            {"A":"B"},
            {"C":"c"},
            {"c":"C"}
        ];
        expect(chains).to.be.deep.equal(expectedChains);

        let hasChains = DictionaryValidator.hasChains(dictionary);
        expect(hasChains).to.be.true;

    });

    it("should find all validation issues", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//chain of a
        dictionary.addToDomainRange("A", "a", false);//cycle of a:A
        dictionary.addToDomainRange("A", "a", false);//NO
        dictionary.addToDomainRange("c", "C", false);//chain of c
        dictionary.addToDomainRange("ca", "C", false);
        dictionary.addToDomainRange("ab", "A", false);
        dictionary.addToDomainRange("C", "c", false);//cycle od c:C chain of C
        dictionary.addToDomainRange("a", "A", false);//NO
        dictionary.addToDomainRange("A", "B", false);//NO
        dictionary.addToDomainRange("c", "C", false);//NO

        expect(dictionary.getEntriesCount()).to.be.equal(6);

        let chains = DictionaryValidator.findChains(dictionary);
        expect(chains).length(4);

    });

    it("should not find cycles", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);
        dictionary.addToDomainRange("b", "B", false);
        dictionary.addToDomainRange("c", "C", false);

        let cycles = DictionaryValidator.findCycles(dictionary);
        expect(cycles).length(0);

        let hasCycles = DictionaryValidator.hasCycles(dictionary);
        expect(hasCycles).to.be.false;

    });

    it("should find cycles", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);
        dictionary.addToDomainRange("A", "a", false);
        dictionary.addToDomainRange("c", "C", false);
        dictionary.addToDomainRange("ca", "C", false);
        dictionary.addToDomainRange("ab", "A", false);
        dictionary.addToDomainRange("C", "c", false);

        let cycles = DictionaryValidator.findCycles(dictionary);
        //console.log(cycles);

        expect(Object.keys(cycles).length).equal(2);


        let hasChains = DictionaryValidator.hasCycles(dictionary);
        expect(hasChains).to.be.true;

    });


    it("should remove all cycles from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK as first
        dictionary.addToDomainRange("c", "C", false);//OK
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("ab", "A", false); //OK
        dictionary.addToDomainRange("C", "c", false);//NO it is a cycle
        dictionary.addToDomainRange("A", "B", false);//INSERTED SINCE NONE of above A are presents. NO it is a chain (?) probably undetected ?

        let removedCycles = DictionaryValidator.removeCycles(dictionary);
        expect(removedCycles.length).to.be.equal(1);
        expect(removedCycles[0]).to.be.deep.equal({C:"c"});
        expect(dictionary.getEntriesCount()).to.be.equal(5);

        expect(dictionary.getEntries()).to.be.deep.equal({
            a:"A",
            c:"C",
            ca:"C",
            ab:"A",
            A:"B"
        });

    });

    it("should remove all chains from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK
        dictionary.addToDomainRange("c", "C", false);//OK - it will be a chain until C:c is removed
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("ab", "A", false); //OK
        dictionary.addToDomainRange("C", "c", false);//it is a chain
        dictionary.addToDomainRange("A", "B", false);//it is a chain

        let removedChains = DictionaryValidator.removeChains(dictionary);
        expect(removedChains.length).to.be.equal(2);
        expect(removedChains[0]).to.be.deep.equal({A:"B"});
        expect(removedChains[1]).to.be.deep.equal({C:"c"});

        expect(dictionary.getEntriesCount()).to.be.equal(4);

        expect(dictionary.getEntries()).to.be.deep.equal({
            a:"A",
            c:"C",
            ca:"C",
            ab:"A"
        });

    });
    it("should remove all chains 2 from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK as first
        dictionary.addToDomainRange("A", "a", false);//chained
        dictionary.addToDomainRange("A", "a", false);//NEVER INSERTED
        dictionary.addToDomainRange("c", "C", false);//chained of below
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("C", "c", false);//Will be removed it is a cycle
        dictionary.addToDomainRange("A", "B", false);//INSERTED SINCE NONE of above A are presents. NO it is a chain (?) probably undetected ?
        //dictionary.addToDomainRange("c", "C", false);//NO it is a Duplicate

        let fixedIssues = DictionaryValidator.removeChains(dictionary);


        expect(dictionary.getEntriesCount()).to.be.equal(3);
        expect(dictionary.getEntries()).to.be.deep.equal({
            a:"A",
            c:"C",
            ca:"C"
        });



    });

    it("should remove all issues, first cycles and then chains from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK as first
        dictionary.addToDomainRange("A", "a", false);//CYCLE
        dictionary.addToDomainRange("A", "a", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//OK
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("ab", "A", false); //OK
        dictionary.addToDomainRange("C", "c", false);//CYCLE
        dictionary.addToDomainRange("a", "A", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("A", "B", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//DUPLICATE - never inserted

        expect(dictionary.getEntriesCount()).to.be.equal(6);

        let validationIssues = DictionaryValidator.findIssues(dictionary);
        expect(validationIssues).to.have.property("cycles");
        expect(validationIssues).to.have.property("chains");

        let removedCycles = DictionaryValidator.removeCycles(dictionary);
        //console.log(removedCycles);
        expect(removedCycles.length).to.be.equal(2);
        expect(dictionary.getEntriesCount()).to.be.equal(4);

        let removedChains = DictionaryValidator.removeChains(dictionary);
        //console.log(removedChains);
        expect(removedChains.length).to.be.equal(0);
        expect(dictionary.getEntriesCount()).to.be.equal(4);

    });

    it("should remove all issues, first chains and then cycles from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK as first
        dictionary.addToDomainRange("A", "a", false);//CYCLE
        dictionary.addToDomainRange("A", "a", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//OK
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("ab", "A", false); //OK
        dictionary.addToDomainRange("C", "c", false);//CYCLE
        dictionary.addToDomainRange("a", "A", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("A", "B", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//DUPLICATE - never inserted

        expect(dictionary.getEntriesCount()).to.be.equal(6);

        let validationIssues = DictionaryValidator.findIssues(dictionary);
        expect(validationIssues).to.have.property("cycles");
        expect(validationIssues).to.have.property("chains");

        let removedChains = DictionaryValidator.removeChains(dictionary);
        //console.log(removedChains);
        expect(removedChains.length).to.be.equal(2);
        expect(dictionary.getEntriesCount()).to.be.equal(4);

        let removedCycles = DictionaryValidator.removeCycles(dictionary);
        //console.log(removedCycles);
        expect(removedCycles.length).to.be.equal(0);
        expect(dictionary.getEntriesCount()).to.be.equal(4);

    });

    it("should remove all issues from dictionary", ()=>{

        let dictionary = new Dictionary();
        dictionary.addToDomainRange("a", "A", false);//OK as first
        dictionary.addToDomainRange("A", "a", false);//CYCLE
        dictionary.addToDomainRange("A", "a", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//OK
        dictionary.addToDomainRange("ca", "C", false); //OK
        dictionary.addToDomainRange("ab", "A", false); //OK
        dictionary.addToDomainRange("C", "c", false);//CYCLE
        dictionary.addToDomainRange("a", "A", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("A", "B", false);//DUPLICATE - never inserted
        dictionary.addToDomainRange("c", "C", false);//DUPLICATE - never inserted

        expect(dictionary.getEntriesCount()).to.be.equal(6);

        let validationIssues = DictionaryValidator.fixIssues(dictionary);
        expect(dictionary.getEntriesCount()).to.be.equal(4);

    });


});