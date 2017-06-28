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


});