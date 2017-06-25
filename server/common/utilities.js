/**
 * Created by marcofalsitta on 21.01.17.
 *
 */
"use strict";

module.exports = function(){
	//logger
	global._indexMap = require('colors');
	global.logger = require('tracer').colorConsole({
		filters : {
			trace : global._indexMap['magenta'],
			debug : global._indexMap['blue'],
			info : global._indexMap['green'],
			warn : global._indexMap['yellow'],
			error : [ global._indexMap['red'], global._indexMap['bold'] ]
		},
		format : [
			"{{title}}: [{{file}}:{{line}}]\t\t{{message}}\n{{timestamp}}\n"
		],
		dateformat : "HH:MM ss.l",
		preprocess :  function(data){
			data.title = data.title.toUpperCase();
		}
	});

    let generateUUID = function(){
        // return "00000000-0000-0000-0000-000000000000";
        // http://www.ietf.org/rfc/rfc4122.txt
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    };


    return {
		logger:global.logger,
        generateUUID:generateUUID
	};

};