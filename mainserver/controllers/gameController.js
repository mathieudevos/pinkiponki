ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');
var games = require(ROOT + '/models/gameModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('game');

var isInVerification = function(username, game){
	var isInVerification = false;

	var gameObject = game.toObject();

	for(i in gameObject.verification){
		if(gameObject.verification.username == username){
			isInVerification = true;
		}
	}

	return isInVerification;
}

module.exports = function(){
	return {

		getGame: function(id, res){
			games.findOne({_id: id}, function(err, game){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				if(game){
					httpResponses.respondObject(res, game);
				}
				else{
					httpResponses.respondFail(res, "Could not find game");
				}
			});
			return ;
		},

		postGame: function(req, res){
			log('Attempting to @POST game for author: ' req.body.author);

			var newgame = new games({
				teamA_player1: req.body.teamA_player1._id,
				teamA_player2: req.body.teamA_player2._id,
				teamB_player1: req.body.teamB_player1._id,
				teamB_player2: req.body.teamB_player2._id,
				teamA_score: req.body.teamA_score,
				teamB_score: req.body.teamB_score,
				verification: [req.body.author._id],
				verified: false,
				author: req.body.author._id,
				timestamp: req.body.timestamp ? req.body.timestamp : new Date()
			})

			newgame.save(function(err){
				if(err)
					httpResponses.sendError(res, err);
				httpResponses.respondObject(res, newgame);
			});

			//todo: add the games to the users as well!

			return;
		},

		postVerify: function(req, res){
			log('Attempting to @POST verify for game');

			//This can only get called by authed users, but better check anyway
			users.findOne({username: req.body.username}, function(err, user){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				games.findOne({_id: req.body.id}, function(err, user){
					if(err){
						httpResponses.sendError(res, req);
						return;
					}
					//We have a user and a game, check if he was part of it.
					if(user.username != game.author.username && (!isInVerification(user.username, game)){
						switch(user.username){
							case game.teamA_player1.username:
								game.verified.push(user.username);
								break;
							case game.teamA_player2.username:
								game.verified.push(user.username);
								break;
							case game.teamB_player1.username:
								game.verified.push(user.username);
								break;
							case game.teamB_player2.username:
								game.verified.push(user.username);
								break;
							default:
								break;
							game.save();
							log('Added user to verified: ' + user.username);
							httpResponses.sendOK(res, 'Added user: ' + user.username + ' to verified.');
							return;
						}
					}else{
						httpResponses.sendFail(res, "Author cannot verify.");
						return;
					}
				});
			});
		},

		getGamesPerUser: function(req, res){
			users.findOne({username: req.body.username}, function(err, user){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				var gamez = [];
				for(i in user.games){
					gamez.unshift(user.games[i]);
					//now it's sorted
				}
				if(gamez.length()>20){
					gamez = gamez.splice(20,(gamez.length-20));
				}
				httpResponses.sendObjects(res, gamez);
			});
			return;
		}



	}
}