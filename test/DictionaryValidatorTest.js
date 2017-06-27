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
let { DictionaryError } = require('../server/lib/DictionaryError');
let { ErrorCode} = require('../server/lib/Error');

let { DictionaryValidator } = require('../server/lib/DictionaryValidator');

describe("Dictionary Validator", ()=>{

	it("should predict duplicates", ()=>{

		let dictionary = new Dictionary();
		dictionary.addEntry({domain:"a", range:"A"});
		dictionary.addEntry({domain:"b", range:"B"});
		dictionary.addEntry({domain:"c", range:"C"});

		let response = DictionaryValidator.willDuplicate("a", "A", dictionary);
		expect(response).to.be.true;

	});


	it("should predict chains", ()=>{

		let dictionary = new Dictionary();
		dictionary.addEntry({domain:"a", range:"A"});
		dictionary.addEntry({domain:"b", range:"B"});
		dictionary.addEntry({domain:"c", range:"C"});

		let response = DictionaryValidator.willChain("A", "L", dictionary);
		expect(response).to.be.true;

	});

	it("should predict cycles", ()=>{

		let dictionary = new Dictionary();
		dictionary.addEntry({domain:"a", range:"A"});
		dictionary.addEntry({domain:"b", range:"B"});
		dictionary.addEntry({domain:"c", range:"C"});

		let response = DictionaryValidator.willCycle("B", "b", dictionary);
		expect(response).to.be.true;

	});

	it("should predict invalidation", ()=>{

		let dictionary = new Dictionary();
		dictionary.addEntry({domain:"a", range:"A"});
		dictionary.addEntry({domain:"b", range:"B"});
		dictionary.addEntry({domain:"c", range:"C"});

		let duplicateInvalidation = DictionaryValidator.willInvalidateDictionary("a", "A", dictionary);
		expect(duplicateInvalidation).to.be.true;

		let chainInvalidation = DictionaryValidator.willInvalidateDictionary("B", "b", dictionary);
		expect(chainInvalidation).to.be.true;

		let cycleInvalidation = DictionaryValidator.willInvalidateDictionary("A", "B", dictionary);
		expect(cycleInvalidation).to.be.true;

		let invalidated = DictionaryValidator.willInvalidateDictionary("e", "B", dictionary);
		expect(invalidated).to.be.false;
	});


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