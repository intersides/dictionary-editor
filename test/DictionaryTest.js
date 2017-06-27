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

describe("Dictionary class", ()=>{


    describe("initialisation", ()=>{

        it("should initialize with id", ()=>{
            let dictionary = new Dictionary("123");
            expect(dictionary.getId()).to.be.equal("123");
            expect(dictionary._domainRangeMap).to.be.empty;
        });

    });

    describe("adding and removing domain/ranges sets", ()=>{

        it("should add domain/rang map entry", ()=>{
            let dictionary = new Dictionary();
            dictionary.addEntry({domain:"Red Apple", range:"Red"});
            dictionary.addEntry({domain:"Blue Noa", range:"Blu"});
            dictionary.addEntry({domain:"Lapilazuli", range:"Blu"});
            dictionary.addEntry({domain:"Venom", range:"Black"});
            dictionary.addEntry({domain:"Widow", range:"Black"});

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
            dictionary.addEntry({domain:"Red Apple", range:"Red"});
            dictionary.addEntry({domain:"Blue Noa", range:"Blu"});
            dictionary.addEntry({domain:"Lapilazuli", range:"Blu"});
            dictionary.addEntry({domain:"Venom", range:"Black"});
            dictionary.addEntry({domain:"Widow", range:"Black"});

            dictionary.removeDomainFromRange("Venom");
            expect(dictionary.getRangeFromDomain("Venom")).to.be.null;

            dictionary.removeDomainFromRange("Blue Noa");

            expect(dictionary.getEntriesCount()).to.be.equal(3);

        });

        it("should remove range with associated domains", ()=>{
            let dictionary = new Dictionary();
            dictionary.addEntry({domain:"Red Apple", range:"Red"});
            dictionary.addEntry({domain:"Blue Noa", range:"Blu"});
            dictionary.addEntry({domain:"Lapilazuli", range:"Blu"});
            dictionary.addEntry({domain:"Venom", range:"Black"});
            dictionary.addEntry({domain:"Widow", range:"Black"});

            dictionary.removeRange("Black");
            expect(dictionary.getEntriesCount()).to.be.equal(3);

            dictionary.removeRange("Black");
            expect(dictionary.getEntriesCount()).to.be.equal(3);

            dictionary.removeRange("Blu");
            expect(dictionary.getEntriesCount()).to.be.equal(1);

        });


    });



});

describe("ColorDictionary class", ()=>{


    it("should init with name", ()=>{
        let cd = new ColorDictionary("smartphones");
        let dicId = cd.getId();
        expect(dicId).to.be.equal("smartphones");
    });

    it("should create content from a json file", ()=>{
        let externalContent = {
	        "Red Apple":"Red",
	        "Blue Noa":"Blu",
	        "Venom":"Black",
	        "Black Widow":"Black",
	        "Stonegrey":"Dark Grey",
	        "Midnight Black": "Black",
	        "Mystic Silver":"Silver",
	        "Strong Coffee":"Silver",
	        "Mild Coffee":"Brown"
        };

	    let cd = new ColorDictionary("smartphones");
	    cd.setFromJSON(externalContent);

	    expect(cd.getEntries()).to.be.deep.equal(externalContent);

    });

	it("should add an entry from a json object and return a single key:value pair", ()=>{
		let entity = {
			domain:"Magic",
			range:"Black"
		};

		let colorDic = new ColorDictionary("smartphones");
		let domainRangeEntry = colorDic.addEntry(entity);
		expect(domainRangeEntry).to.be.deep.equal({
			"Magic":"Black"
		});

	});

	it("should return a DictionaryError trying to add an existing entry from a json entity", ()=>{
		let entity = {
			domain:"Magic",
			range:"Black"
		};

		let colorDic = new ColorDictionary("smartphones");
		let domainRangeEntry = colorDic.addEntry(entity);
		expect(domainRangeEntry).to.be.deep.equal({
			"Magic":"Black"
		});

		//reinsert same item
		let domainError = colorDic.addEntry(entity);
		expect(domainError).to.be.instanceOf(DictionaryError);
		expect(domainError.message).to.be.equal("Failed adding entry to dictionary. The key already exists.");

	});

	it("should return a DictionaryError trying to add an existing entry from a json entity having same content but different case", ()=>{
		let entity = {
			domain:"Magic",
			range:"Black"
		};

		let colorDic = new ColorDictionary("smartphones");
		let domainRangeEntry = colorDic.addEntry(entity);

		//reinsert same item
		let domainError = colorDic.addEntry({
			domain:"Magic",
			range:"black"
		});
		expect(domainError).to.be.instanceOf(DictionaryError);
		expect(domainError.message).to.be.equal("Failed adding entry to dictionary. The key already exists.");

		//reinsert same item
		domainError = colorDic.addEntry({
			domain:"magic",
			range:"Black"
		});
		expect(domainError).to.be.instanceOf(DictionaryError);
		expect(domainError.message).to.be.equal("Failed adding entry to dictionary. The key already exists.");

		//reinsert same item
		domainError = colorDic.addEntry({
			domain:"magic",
			range:"black"
		});
		expect(domainError).to.be.instanceOf(DictionaryError);
		expect(domainError.message).to.be.equal("Failed adding entry to dictionary. The key already exists.");

	});

	it("should remove an entry", ()=>{
		let entity = {
			domain:"Magic",
			range:"Black"
		};

		let colorDic = new ColorDictionary("smartphones");
		let domainRangeEntry = colorDic.addEntry(entity);
		expect(domainRangeEntry).to.be.deep.equal({
			"Magic":"Black"
		});

		//then remove it;
		let response = colorDic.removeEntry(entity);
		expect(response).to.be.true;
		expect(colorDic.getEntries()).to.be.empty;

	});

	it("should remove an entry with different case", ()=>{
		let entity = {
			domain:"Magic",
			range:"Black"
		};

		let entityLowerCase = {
			domain:"magic",
			range:"black"
		};

		let colorDic = new ColorDictionary("smartphones");
		let domainRangeEntry = colorDic.addEntry(entity);
		expect(domainRangeEntry).to.be.deep.equal({
			"Magic":"Black"
		});

		//then remove it;
		let response = colorDic.removeEntry(entityLowerCase);
		expect(response).to.be.true;
		expect(colorDic.getEntries()).to.be.empty;

	});



	it("should get range value from domain", ()=>{
        let colorDictionary = new ColorDictionary();
        let inserted = colorDictionary.addColorAlias("Domain Value", "Range Value");
        expect(inserted).to.be.deep.equal({"Domain Value":"Range Value"});
        let rangeValue = colorDictionary.getRangeFromDomain("Domain Value");
        expect(rangeValue).to.be.equal("Range Value");
    });


    it("should map a color to an alias uniquely (no duplicates) ", ()=>{
        let colorDictionary = new ColorDictionary();

        //insert first entry
        colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");

        //try to duplicate same first entry (domain and range)
        let duplcateError = colorDictionary.addColorAlias("Midnight Blue", "Dark Blue");
        expect(duplcateError).to.be.an.instanceOf(DictionaryError);

        //try to duplicate same first entry (domain only)
        let chainError = colorDictionary.addColorAlias("Midnight Blue", "Darker Bluish");
	    expect(chainError).to.be.an.instanceOf(DictionaryError);

        //inserting a new entry with different domain
        let inserted = colorDictionary.addColorAlias("Intense Blue", "Dark Blue");
	    expect(inserted).to.be.deep.equal({"Intense Blue":"Dark Blue"});

        expect(colorDictionary.getEntriesCount()).to.be.equal(2);


    });

    it("should predict if an item to be inserted will create a cycle", ()=>{
        let colorDictionary = new ColorDictionary();
        colorDictionary.addColorAlias("Stonegrey", "Dark Grey");

        let willCycle = DictionaryValidator.willCycle("Dark Grey", "Stonegrey", colorDictionary);
        expect(willCycle).to.be.true;

        let willChain = DictionaryValidator.willChain("Dark Grey", "Stonegrey", colorDictionary);
        expect(willChain).to.be.true;

        let willInvalidate = DictionaryValidator.willInvalidateDictionary("Dark Grey", "Stonegrey", colorDictionary);
        expect(willInvalidate).to.be.true;

    });


    it("should ensure unique values combination (no Cycles)", ()=>{
        let colorDictionary = new ColorDictionary();
        colorDictionary.addColorAlias("Stonegrey", "Dark Grey");

        let willCycles = DictionaryValidator.willCycle("Dark Grey", "Stonegrey", colorDictionary);
        expect(willCycles).to.be.true;
	    
    });

    it("should ensure that alias colors do not appear in domain name columns (no Chains)", ()=>{
        let colorDictionary = new ColorDictionary();
        colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
        colorDictionary.addColorAlias("Midnight Black", "Black");
        colorDictionary.addColorAlias("Strong Coffee", "Black");
        colorDictionary.addColorAlias("Mystic Silver", "Silver");

        //inserting a chain
        let insertError = colorDictionary.addColorAlias("Dark Grey", "Anthracite");
        expect(insertError).to.be.instanceOf(DictionaryError);
        expect(insertError).to.have.property("code", ErrorCode.CHAIN_FAIL);

    });


});
