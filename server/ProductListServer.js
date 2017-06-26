/**
 * Created by marcofalsitta on 22.03.17.
 * InterSides.net
 *
 */
/**
 * Created by marcofalsitta on 22.03.17.
 * InterSides.net
 *
 */
"use strict";

let Server = require('./common/_Server');
let logger = require('./common/utilities')().logger;
let request = require('request');
let fs = require('fs');


class ProductListServer extends Server{

	constructor(expressServer, mysqlDb){
		super(expressServer, mysqlDb);
		this.addRoutes();
	}

	addRoutes(){
		let self = this;

		this.rest.post('/product/:productId', (req, res)=>{
			res.status(200).json({msg:"OK"});
		});

        this.rest.get('/product/:productId', (req, res)=>{
            let requestedProduct = req.params['productId'];
            logger.log(requestedProduct);
            res.status(200).json({requestedProduct:requestedProduct});
        });




	}

}

module.exports = ProductListServer;