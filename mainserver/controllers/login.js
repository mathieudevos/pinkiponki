ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var crypto = require('crypto');
var random = require('csprng');

var users = require(ROOT + '/models/userModel.js');
var userController = new(require(ROOT + '/controllers/userController'));

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function() {
	return {
		login: function(req, res){
			var username = req.body.username;
			var password = req.body.password;
			if(!req.body.username || !req.body.password){
				httpResponses.sendError(res, "Invalid parameters");
				return ;
			}
			userController.getUser(username, function(err, user){
				if (err) {
					httpResponses.sendError(err, "Could not find user");
					return ;
				} if(user){
					//Actually have a user!
					var temp = user.salt;
					var pw_db = user.password;
					var newpass = temp + password;
					var hash = crypto.createHash('sha512').update(newpass).digest('hex');
					if(pw_db==hash){
						httpResponses.sendLoginOK(res, username);
						return ;
					} else {
						httpResponses.sendFail(res, "fail login: " + username);
						return ;
					}
				}
			});
		},

		isLoggedIn: function(req, res) {
			if (req.isAuthenticated()) { return next(); }
			res.redirect('')
		}
	}
};