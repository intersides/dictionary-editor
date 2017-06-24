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

describe("Simple test", ()=>{
    it("should pass", ()=>{
        expect(true).to.be.true;
    });
});