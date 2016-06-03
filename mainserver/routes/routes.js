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

//This is where all the RESTful interactions happen.
router.get("/", function(req, res){
	res.send("Wrong line boy. \n")
});

//User interactions
router.get('/users', function (req, res) {
	userController.getUsers(req, res)
});

router.get('/users/:username', function (req, res) {
	userController.getUser(req, res)
});

//Login
router.post('/login', function (req, res) {
	loginController.login(req, res)
});

//Register
router.post('/register', function (req, res) {
	registerController.register(req, res)
});

//Error handling


module.exports = router;