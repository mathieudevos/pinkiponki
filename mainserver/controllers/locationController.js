ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var Math = require('mathjs');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');
var games = require(ROOT + '/models/gameModel.js');
var locations = require(ROOT + '/models/locationModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('game');

module.exports = function(){
	return {
		getLocations: function(req, res){
			locations.find({})
					 .sort({name: 1})
					 .select({name: 1, _id: 0})
					 .exec(function(err, locationz){
					 	if(err){
					 		httpResponses.sendError(res, err);
					 		return;
					 	}
					 	response = [];
					 	for(i in locationz)
					 		response.push(locationz[i].name);
					 	log(response);
					 	httpResponses.respondPureString(res, response);
					 	return;
					 });
		},

		postLocation: function(req, res){
			var newlocation = new locations({
				name: req.body.name,
				owner: req.body.owner,
				about: req.body.about ? req.body.about : null
			});

			log(newlocation.toString());

			newlocation.save(function(err){
				if(err){
					httpResponses.sendError(res, err);
					return;
				}
				clubController.addLocation(newlocation.name);
				httpResponses.respondObject(res, newlocation);
			});
		}

	}
}