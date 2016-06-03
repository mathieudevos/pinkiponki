ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var crypto = require('crypto');
var random = require('csprng');

var userHandler = require(ROOT + '/models/userModel.js');
var USERS = new userHandler(); 

var httpResponsesModule = require(ROOT + '/httpResponses/httpResponses.js');
var httpResponses = httpResponsesModule('user');

var mongoose = require('mongoose');

module.exports = function() {
	return {
		register: function(req, res){
			var username = req.body.username;
			var email = req.body.email;
			var password = req.body.password;
			if(email.indexOf("@")==-1){
				httpResponses.sendFail(res, "Email not valid.");
				return;
			}
			if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) && password.length > 4 && password.match(/[0-9]/) && password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)){
				var temp = random(160,36); //salt
				var newpass = temp + password;
				var hashed_pw = crypto.createHash('sha512').update(newpass).digest('hex');
				USERS.findUser(username, function(err, users){
					if (err) {
						httpResponses.sendError(err, "Error finding user");
						return;
					}
					if(users.length==0){
						//Nobody in the db, register this one!
						var newuser = new userHandler({
							username: username,
							email: email,
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							salt: temp,
							password: hashed_pw,
							about: req.body.about
						});
						newuser.save(function (err){
							if (err) {httpResponses.sendError(err, "Error saving user.");}
							httpResponses.sendRegisterOK(res, username);
						});
					}else{
						//User already in the db
						httpResponses.sendFail(res, "User already in db.");
					}
				});
			}else{
				httpResponses.sendFail(res, "Password not strong enough.");
				return;
			}
		}
	}
};