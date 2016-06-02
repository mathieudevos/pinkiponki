ROOT = process.cwd();
var config = require(ROOT + '/config.json');
console.log('Logs are going to: ' +  ROOT + config.log_path);

var winston = require('winston');

var logger = new(winston.Logger)({
	transports: [
	new(winston.transports.Console)({
		json: false,
		timestamp: true
	}),
	new winston.transports.File({
		filename: ROOT + config.log_path + 'debug.log',
		json: false
	})
	],
	exceptionHandlers: [
		new(winston.transports.Console)({
			json: false,
			timestamp: true
		}),
		new winston.transports.File({
		filename: ROOT + config.log_path + 'debug.log',
		json: false
	})],
		exitOnError: false
});

module.exports = logger;