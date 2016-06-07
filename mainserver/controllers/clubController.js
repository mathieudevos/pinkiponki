ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('club');

module.exports = function(){
	return {

		getClub: function(clubname, res){
			clubs.findOne({clubname: clubname}, function(err, club){
				if (club){
					log('found club!');
					httpResponses.respondObject(res, club);
				}else {
					httpResponses.sendFail(res, "No club found: " + req.body.clubname);
				}
			});
			return ;
		},

		getClubs: function(req, res){
			clubs.find(function(err, clubz){
				if(clubz.length>0){
					log('found clubs: ' + clubz.length);
					httpResponses.respondObjects(res, clubz);
				}else{
					httpResponses.sendFail(res, "No clubs found.");
				}
			});
			return ;
		},

		postClub: function(req, res){
			log('attempting to @POST club: ' + req.body.clubname);
			clubs.findOne({clubname: req.body.clubname}, function(err, club){
				if (!club){
					log('Creating club!');

					var newclub = new clubs({
						clubname: req.body.clubname,
						color: req.body.color,
						isGuild: req.body.isGuild,
						about: 	req.body.about,
						maxMembers: req.body.maxMembers,
						authKey: req.body.authKey,
						rating: 1200 	
					});
					newclub.save(function(err){
						if(err)
							httpResponses.sendErr(res, err);
						httpResponses.respondObject(res, newclub);
					})
				} else {
					httpResponses.sendFail(res, "Club already exists");
				}
			});
			return ;
		},

		addMember: function(clubname, req, res){
			clubs.findOne({clubname: clubname}, function(err, club){
				if(club){
					if(club.maxMembers>club.members.length){
						if(req.body.authKey==club.authKey){
							users.findOne({username: req.body.username}, function(err, user){
								if(user){
									club.members.push(user._id);
									user.clubs.push(club._id);
									club.save();
									user.save();
									log("Added: " + user.username + " to club: " + club.clubname);
									httpResponses.sendOK(res, "Added: " + user.username + " to club: " + club.clubname);
								}else{
									httpResponses.sendFail(res, "Cannot find user");
								}
							})
						}else{
							httpResponses.sendFail(res, "authKey wrong");
						}
					}else{
						httpResponses.sendFail(res, "club is full");
					}
				}else {
					httpResponses.sendFail(res, "club not found");
				}
			})
		}
	}
};