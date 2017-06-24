/**
 * Created by marcofalsitta on 21.01.17.
 *
 */
"use strict";

module.exports = function(){
	//logger
	global.colors = require('colors');
	global.logger = require('tracer').colorConsole({
		filters : {
			trace : global.colors['magenta'],
			debug : global.colors['blue'],
			info : global.colors['green'],
			warn : global.colors['yellow'],
			error : [ global.colors['red'], global.colors['bold'] ]
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