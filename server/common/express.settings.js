/**
 * Created by marcofalsitta on 21.01.17.
 *
 */

module.exports = function(){
	"use strict";
	//logger
	let express = require('express');
	let bodyParser = require('body-parser');
	let expressServer = express();

	expressServer.use(express.static('./client/Project List Manager'));
	//expressServer.use(express.static('./lib'));
	expressServer.use(express.static('public'));
	expressServer.use(bodyParser.json()); // for parsing application/json
	expressServer.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

	return expressServer;
};