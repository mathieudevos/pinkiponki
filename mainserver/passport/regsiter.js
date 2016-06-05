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

	// serialize user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// deserialize the user
	passport.deserializeUser(function(id, done){
		users.findById(id, function(err, user){
			done(err, user);
		});
	});

	// register!

	
};