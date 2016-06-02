ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose'),
				Schema = mongoose.Schema,
				bcrypt = require('bcrypt'),
				SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	username: 		{ type: String, requried: true, unique: true},
	password: 		{ type: String, requried: true},
	firstName: 		{ type: String},
	lastName: 		{ type: String},
	about: 			{ type: String},
	email: 			{ type: String},
	clubs: 			{ type: [{type: ObjectId, ref: "clubModel"}]}
});

//JSON never shows pw (dööh)
userSchema.methods.toJson = function(){
	var userObject = this.toObject();

	var response = {
		username: userObject.username ? userObject.username : null,
		firstName: userObject.firstName ? userObject.firstName : null,
		lastName: userObject.lastName ? userObject.lastName : null,
		about: userObject.about ? userObject.about : null,
		email: userObject.email ? userObject.email : null,
		clubs: userObject.clubs ? userObject.clubs : null,
	};

	return response;
};

var userModel = mongoose.model('userModel', userSchema);

module.exports = function userHandler() {
	// Everything that gets exported

	this.findUser = function(username, callback){
		userModel.findOne({
			username: username
		}, callback);
	};

	this.postUser = function(username, userObject, next){
		var lastSeen = new Date();
		var query = { username: username, };
		var hash = bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
			if (err) { log(err); return next(err);}
			bcrypt.hash(userObject.password, salt, function(err, hash){
				if (err) {log(err); return next(err);}
				return hash;
			});
		});

		userModel.findOneAndUpdate(query, {
			$set: {
				username: username,
				password: hash,
				firstName: userObject.firstName,
				lastName: userObject.lastName,
				about: userObject.about,
				email: userObject.email,
				clubs: userObject.clubs
			}
		}, {
			upsert: true
		}, next);
	};

	this.findAllUsers = function (callback){
		userModel.find(callback);
	};

	this.comparePassword = function(username, candidatepw, callback){
		var password = findUser(username).password;
		bcrypt.compare(candidatepw, password, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		});
	};
};