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

	// register!
	passport.use('register', new localStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {
		users.findOne({username: req.body.username}, function(err, user){
			if (err){
				return done(null, false, {error: err.toString()});
			}
			if (user){
				// User already exists
				return done(null, false, {message: 'User already exists'});
			}
			var newuser = new users({
				username: username,
				email: req.body.email,
				password: generateHash(password),
				rating: 1200
			});
			newuser.save(function (err){
				if (err) {return done(null, false, {error: err.toString()});}
				return done(null, newuser, {username: username});
			});
		});
	}));


	// generate hash (bcrypt)
	var generateHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
	};
};