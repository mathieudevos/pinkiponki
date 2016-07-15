ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var fs = require('fs');
var gm = require('gm');
var sizeOf = require('image-size');
var path = require('path');
var formidable = require('formidable');
var util = require('util');
var fileExists = require('file-exists');

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

linkProfilePicture = function(username, pictureLink){
	log("Adding link: " + username + " -> " + pictureLink);
	users.findOne({username: username}, function(err, user){
		if(user){
			user.profilePicture = pictureLink;
			user.save();
		}
	});
	return;
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
			 			linkProfilePicture(req.user.username, files.image.name);
			 			httpResponses.sendOK(res, "upload complete");
			 		}
				});
				return;
			});
		},

		getProfilePicture: function(req, res){
			users.findOne({username: req.params.username}, function(err, user){
				if(user){
					if(user.profilePicture){
						var imgLink = ROOT + '/uploads/profile/' + user.username + '/' + user.profilePicture;
						if(fs.existsSync(imgLink)){
							var img = fs.readFileSync(imgLink);
							httpResponses.sendImage(res, img);
							return;
						}
					}else{
						httpResponses.sendFail(res, "no profile picture");
						return;
					}
				} else {
					httpResponses.sendError(res, "could not find user");
					return;
				}
			});
		},

		getProfileIcon: function(req, res){
			users.findOne({username: req.params.username}, function(err, user){
				if(user){
					if(user.profilePicture){
						var iconLink = ROOT + '/uploads/profile/' + user.username + '/icon.jpg'
						if(fileExists(iconLink)){
							img = fs.readFileSync(iconLink)
							httpResponses.sendImage(res, img);
							return;
						}else{
							var imgLink = ROOT + '/uploads/profile/' + user.username + '/' + user.profilePicture;
							log(imgLink);
							var width = sizeOf(imgLink).width;
							var height = sizeOf(imgLink).height;
							var x_start = (width * 15 / 70).toFixed();
							var x_total  = (width * 40 / 70).toFixed();
							
							gm(imgLink)
								.crop(x_total, height, x_start, 0)
								.resize(40,40)
								.write(iconLink, function (err){
									if(err){
										httpResponses.sendError(res, err);
										return;
									}
									log('File writing done!');
									var img = fs.readFileSync(iconLink);
									if(img)
										httpResponses.sendImage(res, img);
									return;
								});
						}
					} else {
						httpResponses.sendError(res, "could not find profilePicture");
						return;
					}
				} else {
					httpResponses.sendError(res, "could not find user");
					return;
				}
			});
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