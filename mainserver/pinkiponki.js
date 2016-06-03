ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 
var timeout = require('connect-timeout');

var app = express();

module.exports = app;

// Routes
var routes = require(ROOT + '/routes/routes.js');

var config = require(ROOT + '/config.json');
log("HOSTNAME: " + config.server.host);
log("    PORT: " + config.server.port);
log("SSL PORT: " + config.server.sslport);

// Connect to mongoose
mongoose.connect('mongodb://localhost/' + config.database);

var db = mongoose.connection;

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

// Finally listen (normally create HTTP/HTTPS server)
app.use('/', routes);
app.listen(config.server.port);

module.exports = app;