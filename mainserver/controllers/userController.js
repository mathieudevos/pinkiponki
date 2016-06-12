ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

module.exports = function () {
	return {

		getUser: function(username, res){
			users.findOne({username: username}, function(err, user){
				if (user){
					log('found user!');
					httpResponses.respondObject(res, user);
				}else{
					httpResponses.sendFail(res, "No users found.");
				}
			});
			return ;
		},

		getUsers: function(req, res) {
			users.find(function(err, userz){
				if(userz.length>0){
					log('found users: ' + userz.length);
					httpResponses.respondObjects(res, userz);
				}
			});
			return ;
		},

		updateRating: function(username, newrating) {
			users.findOne({username: username}, function(err, user){
				if(user){
					if(newrating>user.maxRating){
						user.maxRating = newrating;
					}
					user.rating = newrating;
					user.save();
					log('User: ' + username + ", new rating: " + newrating);
				}
			});
			return;
		},

		updateUserLastSeen: function(username){
			users.findOne({username: username}, function(err, user){
				if(user){
					user.lastSeen = Date.now;
					user.save();
					log('User: ' + username + " - last seen: " + user.lastSeen);
				}
			});
			return;
		},

		addGame: function(username, gameid){
			users.findOne({username: username}, function(err, user){
				if(user){
					user.games.push(gameis);
					for(i in user.friends){
						addGameFromFriend(user.friends[i], gameid);
					}
					user.save();
					log('User: ' + username + ' was part of a game!');
				}
			})
			return ;
		},

		addGameFromFriend: function(username, gameid){
			users.findOne({username: username}, function(err, user){
				if(user){
					Boolean isInList = false;
					for(i in user.friendsTimeline){
						if(gameid == user.friendsTimeline[i]){
							isInList = true;
						}
					}
					if(!isInList){
						user.friendsTimeline.push(gameid);
						user.save();
						Log('Added game: ' + gameid + ", to user: " + username + " friends' timeline.")
					}

				}
			});
			return;
		},

		getGamesForUser: function(username, number, req, res){
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
		},

		getGamesTimeline: function(username, number, req, res){
			users.findOne({username: username}, function(err, user){
				if(err)
					httpResponses.sendError(res, err);
					return;
				if(user){
					var games = [];
					for(i in user.friendsTimeline){
						games.unshift(user.friendsTimeline[i]);
					}
					if(games.length()>number){
						games = gamez.splice(number,(gamez.length-number));
					}
					httpResponses.sendObjects(res, gamez);
				}
			});
			return;
		}
	}
};