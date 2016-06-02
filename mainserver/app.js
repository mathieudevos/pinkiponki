var express = require('express');
//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'); 

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

module.exports = app;

// Connect to mongoose
mongoose.connect('mongodb://localhost/pinkiponki')

var db = mongoose.connection;

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/users', users);


app.get('/', function(req, res){
    res.send('This is not the webpage you are looking for, dirty hacker!');
});

app.listen(9721);
console.log('Running on port 9721');