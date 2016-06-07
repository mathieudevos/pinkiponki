ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var gameSchema = mongoose.Schema({
	teamA_player1: 		{ type: ObjectId, ref: "userModel", required: true},
	teamA_player2: 		{ type: ObjectId, ref: "userModel", required: true},
	teamB_player1: 		{ type: ObjectId, ref: "userModel", required: true},
	teamB_player2: 		{ type: ObjectId, ref: "userModel", required: true},
	teamA_score: 		{ type: Number, required: true},
	teamB_score: 		{ type: Number, required: true}, 
	author: 			{ type: ObjectId, ref: "userModel", required: true},
	verification: 		{ type: ObjectId, ref: "userModel", required: true},
	verified: 			{ type: Boolean},
	timestamp: 			{ type: Date}
});

gameSchema.methods.toJson = function(){
	var gameObject = this.toObject();

	var verifies = [];
	for(i in gameObject.verification)
		verifies.push(gameObject.verification[i].username);

	var response = {
		teamA_player1: gameObject.teamA_player1.username ? gameObject.teamA_player1.username : null,
		teamA_player2: gameObject.teamA_player2.username ? gameObject.teamA_player2.username : null,
		teamB_player1: gameObject.teamB_player1.username ? gameObject.teamB_player1.username : null,
		teamB_player2: gameObject.teamB_player2.username ? gameObject.teamB_player2.username : null,
		teamA_score: gameObject.teamA_score ? gameObject.teamA_score : 0,
		teamB_score: gameObject.teamB_score ? gameObject.teamB_score : 0,
		verification: verifies,
		verified: gameObject.verified ? gameObject.verified : false,
		author: gameObject.author ? gameObject.author : null,
		timestamp: gameObject.timestamp ? gameObject.timestamp : null
	};

	return response;
};

module.exports = mongoose.model('games', gameSchema);