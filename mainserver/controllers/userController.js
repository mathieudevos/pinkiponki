ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var fs = require('fs');
var path = require('path');
var gm = require('gm').subClass({
	imageMagick: true
});
var formidable = require('formidable');
var util = require('util');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

var hasAsFriend = function(friendlist, friendname){
	for(i in friendlist){
		if(friendlist[i] == friendname){
			return true;
		}
	}
	return false;
}

function handlePicturePost(req, res) {
	if(!req.files){
		log('Invalid parameters (0)');
		httpResponses.sendError(res, "invalid parameters (0)");
		return;
	}

	if(req.files && !req.files.image){
		log('Invalid parameters (1)');
		httpResponses.sendError(res, "invalid parameters (1)");
		return;
	}
	var dir = ROOT + '/uploads';
	var fullpath = dir + '/profile/' + req.user.username + '/' + req.files.image.name;
	var respath = path.resolve(fullpath);
	

	fs.rename(req.files.image.path, respath, function(err){
		if(err){
	 			httpResponses.sendError(res, err);
	 			return;
	 		} else {
	 			updateProfilePicture(req.user.username, req.files.image.originalFilename);
	 			httpResponses.sendOK(res, "upload complete");
	 		}
	});

	// gm(req.files.image.path)
	// 	.write(fullpath, function(err){
	// 		if(err){
	// 			httpResponses.sendError(res, err);
	// 			return;
	// 		} else {
	// 			updateProfilePicture(req.user.username, req.files.image.originalFilename);
	// 			httpResponses.sendOK(res, "upload complete");
	// 		}
	// 	});

		// fs.writeFile(fullpath, data, function(err){
		// 	if (err){
		// 		httpResponses.sendError(res, err);
		// 		return;
		// 	}else {
		// 		updateProfilePicture(req.user.username, req.files.image.originalFilename);
		// 		httpResponses.sendOK(res, "upload complete");
		// 	}

		// });
}

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
					var isInList = false;
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
		},

		addFriend: function(username, friendname, firstfunction, req, res){
			users.findOne({username: username}, function(err, user){
				users.findOne({username: friendname}, function(err, friend){
					if(!hasAsFriend(user.friends, friendname)){
						user.friends.push(friendname);
						user.save();
						if(firstfunction){
							addFriend(friendname, username, false); 
							httpResponses.sendOK(res, "friend added - " + friendname);
							return;
						}
					}
				});
			});
			if(req!=undefined && res!=undefined){
				httpResponses.sendFail("friend adding fail - " + friendname);
			}
		},

		getUsernames: function(req, res){
			users.find({})
				 .sort({username: 1})
				 .select({username : 1, _id : 0})
				 .exec(function(err, userz){
				 	if(err){
						httpResponses.sendError(res, err);
						return;
					}
					response = [];
					for(i in userz)
						response.push(userz[i].username);
					log(response);
					httpResponses.respondPureString(res, response);
					return;
				 });
		},

		uploadProfilePicture: function(req, res){
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields, files){
				req.files = files;

				log(util.inspect({fields: fields, files: files}));

				var dir = ROOT + '/uploads/profile/' + req.user.username + '/';
				var fullpath = dir  + req.files.image.name;
				var respath = path.resolve(fullpath);

				log(respath);

				if(!fs.existsSync(dir)){
					fs.mkdirSync(dir);
				}

				fs.rename(files.image.path, respath, function(err){
					if(err){
			 			httpResponses.sendError(res, err);
			 			return;
			 		} else {
			 			updateProfilePicture(req.user.username, files.image.originalFilename);
			 			httpResponses.sendOK(res, "upload complete");
			 		}
				});
				return;
			});
		},

		updateProfilePicture: function(username, pictureLink){
			log("Adding link: " + username + " -> " + pictureLink);
			users.findOne({username: username}, function(err, user){
				if(user){
					user.profilePicture = pictureLink;
					user.save();
				}
			});
			return;
		},

		getProfilePicture: function(pictureName, res){
			var imgLink = ROOT + '/uploads/profile/' + pictureName;
			var img = fs.readFileSync(imgLink);
			if(img){
				httpResponses.sendImage(res, img);
			}
			return;
		},

		postUser: function(req, res){
			users.findOneAndUpdate(
				{ username: req.user.username},
				{ 
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					about: req.body.about
				}, function(err, user){
					if(err){
						httpResponses.sendError(res, err);
						return;
					}
					if(user){
						httpResponses.sendUsername(res, user.username);
						return;
					}else{
						httpResponses.sendFail(res, "updating user fail");
						return;
					}
				});
			
		}
	}
}