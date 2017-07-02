/**
 * Created by marcofalsitta on 22.01.17.
 *
 */
'use strict';

let fs = require('fs');
let logger = require('../common/utilities')().logger;

let git = require('git-rev');

class Server{

	constructor(expressServer, mysqlDb){
		this.mySqlDb = mysqlDb;
		this.rest = expressServer;
		this.setRoutes();
	}

	connectDb(){
		let self = this;
		return new Promise((resolve, reject)=>{

			if(this.mySqlDb !== null){
				this.mySqlDb.connect(function(err){
					if(err){
						logger.error("mySQLConnection error is raising an exception");
						logger.error(err);
						reject(err);
					}
					else{
						resolve(self);
					}
				});

			}
			else{
				logger.info("no mySQL configuration has been passed to constructor. This server will not have a MySQL Database");
				resolve(self);
			}

		});
	}

	start(port){

		return new Promise((resolve, reject)=>{
			this.rest.listen(port, function(){

				git.short(function (str_short) {
					// => aefdd94
					git.branch(function (branch_str) {
						// => master
						logger.log('git version %s: %s', branch_str, str_short);
					})

				});



				resolve(this);
			}).on('error', function(error){
				reject(error);
			});
		});
	}

	setRoutes(){

		let self = this;

		this.rest.all('*', (req, res, next)=>{
			logger.log('request received', req.path);
			next();
		});

	}

}

module.exports = Server;