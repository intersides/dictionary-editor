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

let {Client} = require("../server/lib/Client");
let {ErrorCode} = require("../server/lib/Error");
let {ClientError} = require("../server/lib/ClientError");
let {DictionaryError} = require("../server/lib/DictionaryError");
let { ColorDictionary } = require('../server/lib/ColorDictionary');

describe("Client class", ()=>{

    describe("initialisation", ()=>{

        it("should init", ()=>{
            let client = new Client("ABC");
            expect(client).to.have.property("name", "ABC");
        });
    });

    describe("creating dictionary of specific type", ()=>{
    	it("should create a color alias dictionary for client", ()=>{

    		let client = new Client("FNAC");
    		client.addDictionary(new ColorDictionary("smartphones"));

    		let smartphonesDic = client.getDictionary("smartphones");
    		expect(smartphonesDic).not.to.be.null;
		    expect(smartphonesDic.getEntries()).to.be.empty;


	    });
    });

    describe("adding items to dictionary", ()=>{

    	it("should create a valid dictionary", ()=>{

    		let singleEntryExpectedResult = {"Magic Black":"Black"};
    		let userReceivedEntry = {
	                    type:"smartphones",
					    value:{
	                        domain:"Magic Black",
						    range:"Black"
	                    }
	                };

		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));
		    let result = client.addEntryToDictionary(userReceivedEntry.value, userReceivedEntry.type);
		    expect(result).not.to.be.instanceOf(ClientError);

		    let dic = client.getDictionary("smartphones");
		    let smartPhonesEntries = dic.getEntries();
		    expect(smartPhonesEntries).to.be.deep.equal(singleEntryExpectedResult);

	    });

	    it("should produce an error trying to duplicate an item", ()=>{

		    let userReceivedEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));
		    client.addEntryToDictionary(userReceivedEntry.value, userReceivedEntry.type);

		    let secondInsertResult = client.addEntryToDictionary(userReceivedEntry.value, userReceivedEntry.type);
		    expect(secondInsertResult).to.be.instanceOf(ClientError);

		    let detailError = secondInsertResult.stackErrors[0];
		    expect(detailError).to.be.instanceOf(DictionaryError);
		    expect(detailError).to.be.have.property("code", ErrorCode.DUPLICATE_FAIL);

	    });

	    it("should produce an error trying to duplicate the domain of an item", ()=>{

		    let entry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let modEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Red"
			    }
		    };


		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));
		    client.addEntryToDictionary(entry .value, entry.type);

		    let secondInsertResult = client.addEntryToDictionary(modEntry.value, modEntry.type);
		    expect(secondInsertResult).to.be.instanceOf(ClientError);

		    let detailError = secondInsertResult.stackErrors[0];
		    expect(detailError).to.be.instanceOf(DictionaryError);
		    expect(detailError).to.be.have.property("code", ErrorCode.DUPLICATE_FAIL);



	    });

	    it("should produce an error when creating a cycle", ()=>{

		    let entry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let modEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Black",
				    range:"Magic Black"
			    }
		    };


		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));
		    client.addEntryToDictionary(entry .value, entry.type);

		    let secondInsertResult = client.addEntryToDictionary(modEntry.value, modEntry.type);
		    expect(secondInsertResult).to.be.instanceOf(ClientError);
		    let detailError = secondInsertResult.stackErrors[0];

		    expect(detailError).to.be.instanceOf(DictionaryError);
		    expect(detailError).to.be.have.property("message", "Failed adding entry to dictionary. It is a cycle.");
		    expect(detailError).to.be.have.property("code", ErrorCode.CYCLE_FAIL);

	    });

	    it("should produce an error when creating a chain", ()=>{

		    let entry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let modEntry = {
			    type:"smartphones",
			    value:{
				    domain:"black",
				    range:"Dark"
			    }
		    };


		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));
		    client.addEntryToDictionary(entry .value, entry.type);

		    let secondInsertResult = client.addEntryToDictionary(modEntry.value, modEntry.type);
		    expect(secondInsertResult).to.be.instanceOf(ClientError);
		    let detailError = secondInsertResult.stackErrors[0];

		    expect(detailError).to.be.instanceOf(DictionaryError);
		    expect(detailError).to.be.have.property("code", ErrorCode.CHAIN_FAIL);

	    });

    });

    describe("removing items from dictionary ", ()=>{

	    it("should remove an existing item from a dictionary", ()=>{

		    let singleEntryExpectedResult = {"Magic Black":"Black"};
		    let userReceivedEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));

		    //first add item
		    client.addEntryToDictionary(userReceivedEntry.value, userReceivedEntry.type);

		    let dic = client.getDictionary("smartphones");
		    let smartPhonesEntries = dic.getEntries();
		    expect(smartPhonesEntries).to.be.deep.equal(singleEntryExpectedResult);

		    //remove item
		    //client.removeAliasFromDictionary()
		    let result = client.removeEntryFromDictionary(userReceivedEntry.value, userReceivedEntry.type);
		    expect(result).to.be.true;
		    expect(smartPhonesEntries).to.be.empty;

	    });

	    it("should return an error trying to remove an non-existing item from a dictionary", ()=>{

		    let singleEntryExpectedResult = {"Magic Black":"Black"};
		    let userReceivedEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Magic Black",
				    range:"Black"
			    }
		    };

		    let nonInsertedEntry = {
			    type:"smartphones",
			    value:{
				    domain:"Albator",
				    range:"Black"
			    }
		    };


		    let client = new Client("FNAC");
		    client.addDictionary(new ColorDictionary("smartphones"));

		    //first add item
		    client.addEntryToDictionary(userReceivedEntry.value, userReceivedEntry.type);

		    let dic = client.getDictionary("smartphones");
		    let smartPhonesEntries = dic.getEntries();
		    expect(smartPhonesEntries).to.be.deep.equal(singleEntryExpectedResult);

		    //remove item
		    //client.removeAliasFromDictionary()
		    let error = client.removeEntryFromDictionary(nonInsertedEntry.value, nonInsertedEntry.type);
		    expect(error).to.be.instanceOf(ClientError);
		    expect(smartPhonesEntries).to.be.deep.equal(singleEntryExpectedResult);

	    });



    });

    describe("editing dictionary", ()=>{

        it("should add and remove dictionaries", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);
            expect(client.getDictionaries()).to.have.property("length", 1);


            let tSets = client.getDictionaries();
            expect(tSets).to.have.property("length", 1);

            client.removeDictionary("smartphones colors");
            tSets = client.getDictionaries();
            expect(tSets).to.have.property("length", 0);

        });


        it("should remove range entry from dictionary", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let smartPhoneDictionary = client.getDictionary("smartphones colors");
            expect(smartPhoneDictionary).to.not.be.null;
            expect(smartPhoneDictionary.getId()).to.be.equal("smartphones colors");
            expect(smartPhoneDictionary.getRangeFromDomain("Mystic Silver")).to.be.equal("Silver");

            let result = client.removeAliasFromDictionary("Black", "smartphones colors");
            expect(result).to.be.true;

            expect(smartPhoneDictionary.hasAlias("Black")).to.be.false;
            expect(smartPhoneDictionary.hasAlias("Silver")).to.be.true;


            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });


        it("should update original value (domain) entry from dictionary", ()=>{

            let colorDictionary = new ColorDictionary("smartphones");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Black Coffee", "smartphones");
            expect(result).to.be.deep.equal({domain:"Black Coffee", range:"Black"});
            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.be.null;
            expect(colorDictionary.getRangeFromDomain("Black Coffee")).to.not.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

        it("should not update original value (domain) entry from dictionary if the updated new values already exists", ()=>{

            let colorDictionary = new ColorDictionary("smartphones");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Midnight Black", "smartphones");
            expect(result).to.be.instanceOf(ClientError);

            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.not.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

        it("should not update original value (domain) entry from dictionary if the updated new values generate a chain", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Black", "smartphones colors");
	        expect(result).to.instanceOf(ClientError);
	        let attachedError = result.stackErrors[0];
	        expect(attachedError).to.have.property("code", ErrorCode.CHAIN_FAIL);

            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.not.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

        it("should update alias (range) entries from dictionary", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateRangeInDictionary("Black", "Nero", "smartphones colors");
	        expect(result).to.be.instanceOf(Array);
	        expect(result[0]).to.be.deep.equal({
		        "domain": "Midnight Black",
		        "range": "Nero"
	        });
	        expect(result[1]).to.be.deep.equal({
		        "domain": "Strong Coffee",
		        "range": "Nero"
	        });

            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.not.be.null;
            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.be.equal("Nero");

            //update Silver range -> Nero
            result = client.updateRangeInDictionary("Silver", "Nero", "smartphones colors");
            expect(result).to.be.instanceOf(Array);
            expect(result[0]).to.be.deep.equal({
	            "domain": "Mystic Silver",
	            "range": "Nero"
            });


            //update Mystic Silver domain -> Mystic Dark
            result = client.updateDomainInDictionary("Mystic Silver", "Mystic Dark", "smartphones colors");
            expect(result).to.be.deep.equal({ domain: 'Mystic Dark', range: 'Nero' });

            expect(colorDictionary.domainIsPresent("Mystic Dark")).to.be.true;
            expect(colorDictionary.domainIsPresent("Mystic Silver")).to.be.false;


            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });


        it("should NOT update alias(range) entries from dictionary if the updated name equals a domain name", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateRangeInDictionary("Silver", "Midnight Black", "smartphones colors");
            expect(result).to.be.instanceOf(DictionaryError);
            expect(result).to.have.property("code", ErrorCode.CHAIN_FAIL);

            //verify that there are no changes
            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.be.equal("Black");

            //console.log("--------------aliasMap--------------");
            //console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });



    });




});