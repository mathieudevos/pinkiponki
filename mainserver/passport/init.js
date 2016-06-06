ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var login = require(ROOT + '/passport/login.js');
var register = require(ROOT + '/passport/register.js');
var users = require(ROOT + '/models/userModel.js');

module.exports = function(passport) {

	// serialize user for the session
	passport.serializeUser(function(user, done) {
		log('serialize user: ' + user._id);
		done(null, user.id);
	});

	// deserialize the user
	passport.deserializeUser(function(id, done){
		users.findById(id, function(err, user){
			log('deserialize user: ' + user._id);
			done(err, user);
		});
	});

	login(passport);
	register(passport);
}