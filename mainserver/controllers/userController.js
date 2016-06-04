ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var users = require(ROOT + '/models/userModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function userHandler() {
	this.getUser = function(username, cb){
		users.findOne({username: username}, cb);
	};

	this.getusers = function(cb) {
		users.find(cb);
	};


};