ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var localStrategy   = require('passport-local').Strategy;
var users = require(ROOT + 'models/userModel.js');
var bCrypt = require('bcrypt-nodejs');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function(passport) {

	// login!
	passport.use('login', new localStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		users.findOne({'username': username}, function(err, user){
			if (err){
				httpResponses.sendError(err, "Error userlookup");
				return ;
			}
			if (!user) {
				httpResponses.sendFail(res, "fail login: " + username);
				return ;
			} 
			if (!user.validatePassword(password)) {
				httpResponses.sendFail(res, "fail login: " + username);
				return ;
			}
			// '/loginOK' will handle the user to post a message!
			return (null, user);
		});
		}
	));
};