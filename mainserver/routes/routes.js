ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');

var express = require('express');
var router = express.Router();

// call all controllers
var userController = new(require(ROOT + '/controllers/userController.js'));
var clubController = new(require(ROOT + '/controllers/clubController.js'));
var gameController = new(require(ROOT + '/controllers/gameController.js'));
var locationController = new(require(ROOT + '/controllers/locationController.js'));

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
		log('@GET /users/' + req.params.username);
		userController.getUser(req.params.username, res);
	});

	router.get('/friendsTimeline/:number', isAuthenticated, function(req, res){
		log('@GET ' + req.params.number + ' friendsTimeline games for: ' + req.user.username);
		userController.getGamesTimeline(req.user.username, req.params.number, req, res);
	});

	router.post('/friends/:friendname', isAuthenticated, function(req, res){
		log('@POST /friends/ to add friend: ' + req.params.friendname + ' for user: ' + req.user.username);
		userController.addFriend(req.user.username, req.params.friendname, true, req, res);
	});

	router.get('/usernames', isAuthenticated, function(req, res){
		log('@GET  /usernames');
		userController.getUsernames(req, res);
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
	router.post('/games', isAuthenticated, function(req, res){
		log('@POST /games');
		gameController.postGame(req, res);
	});

	router.post('/games/:id/verify', isAuthenticated, function(req, res){
		log('@POST verify for game with id: ' + req.params.id);
		gameController.postVerify(req.params.id, req, res);
	});

	router.get('/games/:id', isAuthenticated, function(req, res){
		log('@GET /games with id');
		gameController.getGame(req.params.id, res);
	});

	router.get('/games/:username/:number', isAuthenticated, function(req, res){
		log('@GET ' + req.params.number + ' games for: ' + req.params.username);
		userController.getGamesPerUser(req.params.username, req.params.number, req, res);
	});

	router.get('/games_all/:number', isAuthenticated, function(req, res){
		log('@GET general games, number: ' + req.params.number);
		gameController.getGames(req.params.number, res);
	});


	//Location interactions
	router.get('/locations', isAuthenticated, function(req, res){
		log('@GET locations');
		locationController.getLocations(req, res);
	});




	//Error handling

	return router;
}