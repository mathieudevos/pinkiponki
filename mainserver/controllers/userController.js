ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var userHandler = require(ROOT + '/models/userModel.js');
var USERS = new userHandler(); 
var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function() {
	return {
		getUsers: function(req, res) {

		},

		getUser: function(req, res) {

		}
	}
};