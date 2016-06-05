ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var express = require('express');
var router = express.Router();

// call all controllers
var loginController = new(require(ROOT + '/controllers/login.js'));
//var changepwdController = new(require(ROOT + '/controllers/changepwd.js'));
var userController = new(require(ROOT + '/controllers/userController.js'));
var registerController = new(require(ROOT + '/controllers/register.js'));
var httpResponses = new(require(ROOT + '/httpResponses/httpResponses.js'));

//This is where all the RESTful interactions happen.
router.get("/", function(req, res){
	res.send("Wrong line boy. \n")
});



// passport isAuthenticated function
var isAuthenticated = function (req, res, next){
	if(req.isAuthenticated())
		return next;
	res.redirect('/login');
}

module.exports = function(passport) {

	//Login
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/loginOK',
		failureRedirect: '/login'
	}));

	router.get('/loginOK', isAuthenticated, function(res, req){
		httpResponses.sendLoginOK(res, req.user);
	})

	//Logout
	router.get('/logout', function(req, res){
		var username = req.user;
		req.logout();
		httpResponses.sendLogout(res, username);
	});

	//Register
	router.post('/register', function (req, res) {
		registerController.register(req, res)
	});

	//User interactions
	router.get('/users', isAuthenticated, function (req, res) {
		userController.getUsers(req, res)
	});

	router.get('/users/:username', isAuthenticated, function (req, res) {
		userController.getUser(req, res)
	});

	//Error handling

	return router;
}