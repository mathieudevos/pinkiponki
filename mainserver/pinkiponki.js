ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var mongoStore = require('connect-mongo/es5')(session);
var timeout = require('connect-timeout');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var app = express();

module.exports = app;

var config = require(ROOT + '/config.json');
log("HOSTNAME: " + config.server.host);
log("    PORT: " + config.server.port);
log("SSL PORT: " + config.server.sslport);

// Connect to mongoose
mongoose.connect('mongodb://localhost/' + config.database);

var db = mongoose.connection;

app.use(ROOT + '/public', express.static('public'))

app.use(timeout(config.timeout));

app.use(bodyParser.urlencoded({
  extended: true
}));

var StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');
app.use(bodyParser.json({
  verify: function verify(req, res, buf, encoding){
    log('verify');
    req.rawBody = decoder.write(buf);
  }
}));

// Session
var sessionOptions = {
  saveUninitialized: true, //save new sessions
  resave: false,
  store: new mongoStore({ 
    mongooseConnection: db,
    collection: 'sessions'
    }),
  secret: config.session.secret,
  cookie: { httpOnly: true, maxAge: 3600000 }
}

// Cookies, passport & session
app.use(cookieParser(config.session.secret));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport
var initPassport = require(ROOT + '/passport/init.js');
initPassport(passport);

// Finally use routes w/ passport & listen on port
var routes = require(ROOT + "/routes/routes.js")(passport);
app.use('/', routes);
app.listen(config.server.port);

module.exports = app;