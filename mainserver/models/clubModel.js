ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var clubSchema = mongoose.Schema({
	clubname: 		{ type: String, required: true, unique: true},
	about: 			{ type: String},
	isGuild: 		{ type: Boolean, required: true},
	color: 			{ type: String},
	maxMembers: 	{ type: Number},
	authKey: 		{ type: String, required: true},
	members: 		{ type: [{type: ObjectId, ref: "users"}]},
	rating: 		{ type: Number}
});

// toJson
clubSchema.methods.toJson = function(){
	var clubObject = this.toObject();

	var members = [];
	for(i in clubObject.members)
		members.push(clubObject.members[i].username);

	// don't print authkey, only admin can see it from mongodb panel.
	var response = {
		clubname: clubObject.clubname ? clubObject.clubname : null,
		about: clubObject.about ? clubObject.about : null,
		isGuild: clubObject.isGuild ? clubObject.isGuild : false,
		rating: clubObject.rating ? clubObject.rating : null,
		members: members,
		color: clubObject.color ? clubObject.color : null,
		maxMembers: clubObject.maxMembers ? clubObject.maxMembers : null
	};

	return response;
};

module.exports = mongoose.model('clubs', clubSchema);