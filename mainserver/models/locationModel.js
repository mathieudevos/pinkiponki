ROOT = process.cwd();
HELPERS = require(ROOT + '/helpers/general.js');
log = HELPERS.log;
var config = require(ROOT + '/config.json');
var mongoose = 	require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var locationSchema = mongoose.Schema({
	name: 		{ type: String, required: true, unique: true},
	owner: 		{ type: String, ref: "clubs", required: true},
	about: 		{ type: String}
});

locationSchema.methods.toJson = function(){
	var locationObject = this.toObject();

	var response = {
		name: locationObject.name ? locationObject.name : null,
		owner: locationObject.owner ? locationObject.owner : null,
		about: locationObject.about ? locationObject.about : null
	};

	return response;
}

module.exports = mongoose.model('locations', locationSchema);