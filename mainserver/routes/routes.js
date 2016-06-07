ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var express = require('express');
var router = express.Router();

// call all controllers
var userController = new(require(ROOT + '/controllers/userController.js'));
var clubController = new(require(ROOT + '/controllers/clubController.js'));
var httpResponses = new(require(ROOT + '/httpResponses/httpResponses.js'));

var bodyParser = require('body-parser');

//This is where all the RESTful interactions happen.
router.get("/", function(req, res){
	res.send("Wrong line boy. \n")
});



// passport isAuthenticated function
var isAuthenticated = function (req, res, next){
	if(req.isAuthenticated()){
		log('You are authorized!');
		return next();
	}
	log('unAuthorized, sending fail!');
	httpResponses.sendFail(res, "unAuthorized");
	//res.redirect('/login');
}

module.exports = function(passport) {

	//Login
	router.post('/login', passport.authenticate('login', {failWithError: true}),
		function(req, res, next){
			// Handle success
			log('Login complete: ' + req.user.username);
			httpResponses.sendLoginOK(res, req.user.username);
			return ;
		},
		function(err, req, res, next){
			// Handle error
			return res.json(err);
		}
	);

	//Register
	router.post('/register', passport.authenticate('register', {failWithError: true}),
		function(req, res, next){
			// Handle success
			httpResponses.sendRegisterOK(res, req.user.username);
			return ;
		},
		function(err, req, res, next){
			// Handle error
			return res.json(err);
		}
	);

	//Logout
	router.get('/logout', function(req, res){
		var username = req.user;
		req.logout();
		httpResponses.sendLogout(res, username);
	});

	//User interactions
	router.get('/users', isAuthenticated, function (req, res) {
		log('@GET /users');
		userController.getUsers(req, res);
	});

	router.get('/users/:username', isAuthenticated, function (req, res) {
		log('@GET /users/' + req.body.username);
		userController.getUser(req, res);
	});

	//Club interactions
	router.post('/clubs', isAuthenticated, function (req, res) {
		clubController.postClub(req, res);
	});

	router.get('/clubs/:clubname', isAuthenticated, function(req, res) {
		log('@GET /clubs/' + req.params.clubname);
		clubController.getClub(req.params.clubname, res);
	});

	router.get('/clubs', isAuthenticated, function(req, res) {
		log('@GET /clubs');
		clubController.getClubs(req, res);
	});

	router.post('/clubs/:clubname/addMember', isAuthenticated, function(req, res) {
		clubController.addMember(req.params.clubname, req, res);
	});

	//Game interactions
	

	//Error handling

	return router;
}