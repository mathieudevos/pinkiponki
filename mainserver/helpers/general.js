ROOT = process.cwd();
var logger = require(ROOT + '/logs/log');

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

// Continue functions as needed by other Controllers