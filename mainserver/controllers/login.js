ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var crypto = require('crypto');
var random = require('csprng');

var userHandler = require(ROOT + '/models/userModel.js');
var USERS = new userHandler(); 

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function() {
	return {
		login: function(req, res){
			var username = req.body.username;
			var password = req.body.password;
			if(!req.body.username || !req.body.password){
				httpResponses.sendError(res, "Invalid parameters");
				return;
			}
			USERS.findUser(username, function(err, user){
				if (err) {
					httpResponses.sendError(err, "Could not find user");
					return;
				} else {
					//Actually have a user!
					var temp = user.salt;
					var pw_db = user.password;
					var newpass = temp + password;
					var hash = crypto.createHash('sha512').update(newpass).digest('hex');
					if(pw_db==hash){
						httpResponses.sendLoginOK(res, username);
						return;
					} else {
						httpResponses.sendLoginFAIL(res, username);
						return;
					}
				}
			});
		}
	}
};