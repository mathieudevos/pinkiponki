ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var bcrypt = require('bcrypt');
var ObjectId = mongoose.Schema.ObjectId;

var userSchema = mongoose.Schema({
	username: 		{ type: String, required: true, unique: true, lowercase: true},
	password: 		{ type: String, required: true},
	firstName: 		{ type: String},
	lastName: 		{ type: String},
	about: 			{ type: String},
	email: 			{ type: String, lowercase: true},
	clubs: 			{ type: [{type: String, ref: "clubs"}]},
	games: 			{ type: [{type: ObjectId, ref: "games"}]}, 
	rating:  		{ type: Number},
	maxRating: 		{ type: Number},
	friends: 		{ type: [{Type: String}]},
	friendsTimeline: { type: [{type: ObjectId, ref: "games"}]},
	created: 		{ type: Date},
	lastSeen:  		{ type: Date}
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

	var friends = [];
	for (i in userObject.friends)
		friends.push(userObject.friends[i]);

	var friendsTimeline = [];
	for (i in userObject.friendsTimeline)
		friendsTimeline.push(userObject.friendsTimeline[i]);

	var response = {
		username: userObject.username ? userObject.username : null,
		firstName: userObject.firstName ? userObject.firstName : null,
		lastName: userObject.lastName ? userObject.lastName : null,
		about: userObject.about ? userObject.about : null,
		email: userObject.email ? userObject.email : null,
		clubs: clubs,
		games: games,
		rating: userObject.rating ? userObject.rating : null,
		maxRating: userObject.maxRating ? userObject.maxRating : null,
		friends: friends,
		friendsTimeline: friendsTimeline,
		created: userObject.created ? userObject.created : null,
		lastSeen: userObject.lastSeen ? userObject.lastSeen : null
	};

	return response;
};

// check pw
userSchema.methods.validatePassword = function(newpw){
	return bcrypt.compareSync(newpw, this.password);
}

module.exports = mongoose.model('users', userSchema)
