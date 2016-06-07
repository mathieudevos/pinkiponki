ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.ObjectId;

var userSchema = mongoose.Schema({
	username: 		{ type: String, required: true, unique: true},
	password: 		{ type: String, required: true},
	firstName: 		{ type: String},
	lastName: 		{ type: String},
	about: 			{ type: String},
	email: 			{ type: String},
	clubs: 			{ type: [{type: ObjectId, ref: "clubModel"}]},
	games: 			{ type: [{type: ObjectId, ref: "gameModel"}]}, 
	rating:  		{ type: Number}
});

//Methods

// toJSON
userSchema.methods.toJson = function(){
	var userObject = this.toObject();

	var clubs = [];
	for (i in userObject.clubs)
		clubs.push(userObject.clubs[i].clubname);

	var games = [];
	for (i in userObject.games)
		games.push(userObject.games[i]._id);

	var response = {
		username: userObject.username ? userObject.username : null,
		firstName: userObject.firstName ? userObject.firstName : null,
		lastName: userObject.lastName ? userObject.lastName : null,
		about: userObject.about ? userObject.about : null,
		email: userObject.email ? userObject.email : null,
		rating: userObject.rating ? userObject.rating : null,
		clubs: clubs,
		games: games
	};

	return response;
};

// check pw
userSchema.methods.validatePassword = function(newpw){
	return bcrypt.compareSync(newpw, this.password);
}

module.exports = mongoose.model('users', userSchema)
