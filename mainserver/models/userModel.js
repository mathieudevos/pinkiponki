ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	username: 		{ type: String, requried: true, unique: true},
	password: 		{ type: String, requried: true},
	firstName: 		{ type: String},
	lastName: 		{ type: String},
	about: 			{ type: String},
	email: 			{ type: String},
	//clubs: 			{ type: [{type: ObjectId, ref: "clubModel"}]},
	rating:  		{ type: Number}
});

//Methods

// toJSON
userSchema.methods.toJson = function(){
	var userObject = this.toObject();

	var response = {
		username: userObject.username ? userObject.username : null,
		firstName: userObject.firstName ? userObject.firstName : null,
		lastName: userObject.lastName ? userObject.lastName : null,
		about: userObject.about ? userObject.about : null,
		email: userObject.email ? userObject.email : null,
		rating: userObject.rating ? userObject.rating : null
		//clubs: userObject.clubs ? userObject.clubs : null,
	};

	return response;
};

// check pw
userSchema.methods.validatePassword = function(newpw){
	return bcrypt.compareSync(newpw, this.password);
}

module.exports = mongoose.model('users', userSchema)
