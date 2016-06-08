ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var Math = require('mathjs');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');
var games = require(ROOT + '/models/gameModel.js');

var userController = require(ROOT + '/controllers/userController.js');
var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('game');

var isInVerification = function(username, game){
	var isInVerification = false;

	var gameObject = game.toObject();

	for(i in gameObject.verification){
		if(gameObject.verification == username){
			isInVerification = true;
		}
	}

	return isInVerification;
}

updateRating = function(game){
	//This only gets called when verified is set to true
	var a_1 = 0;
	var a_2 = 0;
	var b_1 = 0;
	var b_2 = 0;

	users.findOne({username: game.teamA_player1}, function(err, user){
		if(user)
			a_1 = user.rating;		
	});

	users.findOne({username: game.teamA_player2}, function(err, user){
		if(user)
			a_2 = user.rating;		
	});

	users.findOne({username: game.teamB_player1}, function(err, user){
		if(user)
			b_1 = user.rating;		
	});

	users.findOne({username: game.teamB_player2}, function(err, user){
		if(user)
			b_2 = user.rating;		
	});


	var a_rating_old = (a_1+a_2)/2;
	var b_rating_old = (b_1+b_2)/2;

	var a_rating_new = 0;
	var b_rating_new = 0;

	if(game.teamA_score>game.teamB_score){
		a_rating_new = ratingChange(a_rating_old, b_rating_old, true);
		b_rating_new = ratingChange(b_rating_old, a_rating_old, false);
	}else{
		a_rating_new = ratingChange(a_rating_old, b_rating_old, false);
		b_rating_new = ratingChange(b_rating_old, a_rating_old, true);
	}

	var a_rating_change = a_rating_new - a_rating_old;
	var b_rating_change = b_rating_new - b_rating_old;

	a_1 += Math.round(a_rating_change * (a_rating_old/a_1));
	a_2 += Math.round(a_rating_change * (a_rating_old/a_2));
	b_1 += Math.round(b_rating_change * (b_rating_old/b_1));
	b_2 += Math.round(b_rating_change * (b_rating_old/b_2));
	
	userController.updateRating(game.teamA_player1, a_1);
	userController.updateRating(game.teamA_player2, a_2);
	userController.updateRating(game.teamB_player1, b_1);
	userController.updateRating(game.teamB_player2, b_2);
}

var ratingChange = function(initialRating, opponentRating, victory){
	var newRating = 0;

	log('Initial rating: ' + ' - Opponent rating: ' + ' - Victory: ' + victory);

	var initialRatingT = Math.pow(10,(initialRating/400.0));
	log('Initial Rating Transform: ' + initialRatingT);

	var opponentRatingT = Math.pow(10,(opponentRating/400.0));
	log('Opponent Rating Transform: ' + opponentRatingT);

	var victoryProbability = (initialRatingT / (initialRatingT+opponentRatingT));
	log('Victory probability: ' + victoryProbability);

	if(victory){
		newRating = initialRating + config.Kfactor * (1 - victoryProbability);
	}else{
		newRating = initialRating - config.Kfactor * victoryProbability;
	}

	log('Initial rating: ' + initialRating + " - New rating: " + newRating);

	return newRating;
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
			log('Attempting to @POST game for author: ' + req.body.author);

			var newgame = new games({
				teamA_player1: req.body.teamA_player1,
				teamA_player2: req.body.teamA_player2,
				teamB_player1: req.body.teamB_player1,
				teamB_player2: req.body.teamB_player2,
				teamA_score: req.body.teamA_score,
				teamB_score: req.body.teamB_score,
				verification: [req.body.author],
				verified: false,
				author: req.body.author,
				timestamp: req.body.timestamp ? req.body.timestamp : new Date()
			});

			log(newgame.toString());

			newgame.save(function(err){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				users.findOne({username: newgame.teamA_player1}, function(err, user){
					if(err){
						httpResponses.sendError(res, err);
						return;
					}
					user.games.push(newgame._id);
					user.save();
				});
				users.findOne({username: newgame.teamA_player2}, function(err, user){
					if(err){
						httpResponses.sendError(res, err);
						return;
					}
					user.games.push(newgame._id);
					user.save();
				});
				users.findOne({username: newgame.teamB_player1}, function(err, user){
					if(err){
						httpResponses.sendError(res, err);
						return;
					}
					user.games.push(newgame._id);
					user.save();
				});
				users.findOne({username: newgame.teamB_player2}, function(err, user){
					if(err){
						httpResponses.sendError(res, err);
						return;
					}
					user.games.push(newgame._id);
					user.save();
				});
				httpResponses.respondObject(res, newgame);
			});
			return;
		},

		postVerify: function(id, req, res){
			//This can only get called by authed users, but better check anyway
			users.findOne({username: req.body.username}, function(err, user){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				games.findOne({_id: id}, function(err, game){
					if(err){
						httpResponses.sendError(res, req);
						return;
					}
					if(!game){
						httpResponses.sendFail(res, "Could not find game.");
						return;
					}
					//We have a user and a game, check if he was part of it.
					if((user.username != game.author) && (!isInVerification(user.username, game))){
						switch(user.username){
							case game.teamA_player1:
								game.verification.push(user.username);
								break;
							case game.teamA_player2:
								game.verification.push(user.username);
								break;
							case game.teamB_player1:
								game.verification.push(user.username);
								break;
							case game.teamB_player2:
								game.verification.push(user.username);
								break;
							default:
								break;
						}
						log('Added user to verified: ' + user.username);

						if(game.verification.length>=3){
							log('updating ratings!');
							game.verified = true;
							updateRating(game);
						}
						game.save();

						httpResponses.sendOK(res, 'Added user: ' + user.username + ' to verified.');
						return;
					}else{
						httpResponses.sendFail(res, "Author cannot verify.");
						return;
					}
				});
			});
		},

		getGamesPerUser: function(username, number, req, res){
			users.findOne({username: username}, function(err, user){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				var gamez = [];
				for(i in user.games){
					gamez.unshift(user.games[i]);
					//now it's sorted
				}
				if(gamez.length()>number){
					gamez = gamez.splice(number,(gamez.length-number));
				}
				httpResponses.sendObjects(res, gamez);
			});
			return;
		}
	}
}