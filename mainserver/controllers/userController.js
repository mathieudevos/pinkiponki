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

		getUser: function(req, res){
			users.findOne({username: req.body.username}, function(err, user){
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
		}

		
	}
};