/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */
'use strict';

//common modules
let logger = require('./common/utilities')().logger;

let gConfig = require('../config');
global.ROOT = __dirname;


let expressSettings = require('./common/express.settings')();
let ProductListServer = require('./ProductListServer');

//NOTE: no need for mysql support for this server.
//let mysqlDb = require('mysql').createConnection({
//    host     : gConfig.MySQLServer.host,
//    user     : gConfig.MySQLServer.user,
//    password : gConfig.MySQLServer.password
//    //database : commonConfig.db.database
//});
let mysqlDb = null;


let server = new ProductListServer(expressSettings, mysqlDb);
server.connectDb()
    .catch((exception)=>{
        logger.error(exception);
    })
    .then((/** ProductListServer */self)=>{

        if(self.mySqlDb){
            logger.log(`db connected`);
        }
        self.start(gConfig.ProductsListManager.port)
            .catch((exc)=>{
                logger.error(exc);
            })
            .then((restServer)=>{
                logger.info(`Project List Manager - Rest Server started and listening on port ${gConfig.ProductsListManager.host}:${restServer.address().port}! `);
            })
    });

