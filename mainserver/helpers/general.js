ROOT = process.cwd();
var logger = require(ROOT + '/logs/log');
var crypto = require('crypto');
var uuid = require('node-uuid');


// INFO logging 
this.log = function (m){
	logger.info(m);
}

// Get Unique ID
this.getUniqueId = function (){
	return 'id' + (new Date()).getTime();
}

// Get Universial Unique ID
this.getUUID = function (){
	return uuid.v4();
}

this.md5 = function(s) {
	return crypto.createHash('md5').update(s).digest('hex');
}
// Continue functions as needed by other Controllers