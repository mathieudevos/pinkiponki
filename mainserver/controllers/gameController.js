ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var users = require(ROOT + '/models/userModel.js');
var clubs = require(ROOT + '/models/clubModel.js');
var games = require(ROOT + '/models/gameModel.js');

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('game');

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
				
			})
		}


	}
}