ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var localStrategy   = require('passport-local').Strategy;
var users = require(ROOT + '/models/userModel.js');
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
				log('Error: ' + err.toString());
				return done(err);
			}
			if (!user) {
				log('Could not find user');
				return done(null, false, {message: 'Fail login: ' + username});
			} 
			if (!user.validatePassword(password)) {
				log('Wrong password');
				return done(null, false, {message: 'Fail login: ' + username});
			}
			return done(null, user);
		});
		}
	));
};