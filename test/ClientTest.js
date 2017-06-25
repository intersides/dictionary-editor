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
let { ColorDictionary } = require('../server/lib/ColorDictionary');


describe("Client class", ()=>{

    describe("initialisation", ()=>{

        it("should init", ()=>{
            let client = new Client("ABC");
            expect(client).to.have.property("name", "ABC");
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

        it("should remove original value (domain) entry from dictionary", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.removeDomainFromDictionary("Strong Coffee", "smartphones colors");
            expect(result).to.be.true;
            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");


        });

        it("should update original value (domain) entry from dictionary", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Black Coffee", "smartphones colors");
            expect(result).to.be.true;
            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.be.null;
            expect(colorDictionary.getRangeFromDomain("Black Coffee")).to.not.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

        it("should not update original value (domain) entry from dictionary if the updated new values already exists", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Midnight Black", "smartphones colors");
            expect(result).to.be.false;
            expect(colorDictionary.getRangeFromDomain("Strong Coffee")).to.not.be.null;

            console.log("--------------aliasMap--------------");
            console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

        it("should not update original value (domain) entry from dictionary if the updated new values is a range value", ()=>{

            let colorDictionary = new ColorDictionary("smartphones colors");
            colorDictionary.addColorAlias("Stonegrey", "Dark Grey");
            colorDictionary.addColorAlias("Midnight Black", "Black");
            colorDictionary.addColorAlias("Strong Coffee", "Black");
            colorDictionary.addColorAlias("Mystic Silver", "Silver");

            let client = new Client();
            client.addDictionary(colorDictionary);

            let result = client.updateDomainInDictionary("Strong Coffee", "Black", "smartphones colors");
            expect(result).to.be.false;
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
            expect(result).to.be.true;
            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.not.be.null;
            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.be.equal("Nero");

            //update Silver range -> Nero
            result = client.updateRangeInDictionary("Silver", "Nero", "smartphones colors");
            expect(result).to.be.true;

            //update Mystic Silver domain -> Mystic Dark
            result = client.updateDomainInDictionary("Mystic Silver", "Mystic Dark", "smartphones colors");
            expect(result).to.be.true;
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
            expect(result).to.be.false;

            //verify that there are no changes
            expect(colorDictionary.getRangeFromDomain("Midnight Black")).to.be.equal("Black");

            //console.log("--------------aliasMap--------------");
            //console.log(JSON.stringify(colorDictionary._domainRangeMap, null, '\t'), "\n");

        });

    });




});