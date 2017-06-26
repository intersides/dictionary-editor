/**
 * Created by marcofalsitta on 03.03.17.
 *
 */

//  config.js
//
//  Simple application configuration. Extend as needed.
module.exports = {
	MySQLServer:{
		host: '127.0.0.1',
		user: 'root',
		password: 'root',
		port: 3306,
		databases:{
			ProductsList:'products_list'
		}
	},
    ProductsListManager:{
		protocol:"http",
        host: '127.0.0.1',
        port: 8080
    },

};