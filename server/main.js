/**
 * Created by marcofalsitta on 26.06.17.
 * InterSides.net
 *
 */
'use strict';

//common modules
let logger = require('./common/utilities')().logger;

let gConfig = require('../config');

let expressSettings = require('./common/express.settings')();
let ProductListServer = require('./ProductListServer');
let mysqlDb = require('mysql').createConnection({
    host     : gConfig.MySQLServer.host,
    user     : gConfig.MySQLServer.user,
    password : gConfig.MySQLServer.password
    //database : commonConfig.db.database
});


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
                logger.info(`Ebay Rest Server started and listening on port ${restServer.address().port}! `);
            })
    });

