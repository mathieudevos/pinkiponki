ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = require('mongoose');