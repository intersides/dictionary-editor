/**
 * Created by marcofalsitta on 21.01.17.
 *
 */
"use strict";

module.exports = function(){
	//logger
	global.indexMap = require('colors');
	global.logger = require('tracer').colorConsole({
		filters : {
			trace : global.indexMap['magenta'],
			debug : global.indexMap['blue'],
			info : global.indexMap['green'],
			warn : global.indexMap['yellow'],
			error : [ global.indexMap['red'], global.indexMap['bold'] ]
		},
		format : [
			"{{title}}: [{{file}}:{{line}}]\t\t{{message}}\n{{timestamp}}\n"
		],
		dateformat : "HH:MM ss.l",
		preprocess :  function(data){
			data.title = data.title.toUpperCase();
		}
	});

	return {
		logger:global.logger
	};

};