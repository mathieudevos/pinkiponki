var mask = require('json-mask');

var HELPERS = require(ROOT + '/helpers/general.js');
var log = HELPERS.log;

function writeStringResponse(res, status, responseString) {
	var content = responseString.toString();
	var md5 = HELPERS.md5(content);

	res.writeHead(status,
	{
		"Content-Type": "application/json",
		"Content-MD5": md5
	});
	res.write(content);
	res.end();
	return;
};

function getFormattedJSON(myObject){
			return JSON.stringify(myObject, null, 4) + '\n';
};

module.exports = function (objectType) {
	return {

		// Login 
		sendLoginOK: function(res, message) {
			var content = getFormattedJSON({
				username: message.toString(),
			})
			writeStringResponse(res, 200, content);
			return;
		},

		//Logout
		sendLogoutOK: function(res, message){
			var content = getFormattedJSON({
				username: message.toString(),
			});
			writeStringResponse(res, 200, content);
			return;
		},

		// Register
		sendRegisterOK: function(res, message) {
			var content = getFormattedJSON({
				username: message.toString(),
			})
			writeStringResponse(res, 200, content);
			return;
		},

		// Error
		sendError: function(res, error) {
			log("Error occured: " + error.toString());
			var errorMsg = error ? error.toString() : "No error detail.";
			writeStringResponse(res, 401, errorMsg);
		},

		// Fail
		sendFail: function(res, msg) {
			log("Fail occured: " + msg);
			var content = getFormattedJSON({
				message: msg
			});
			writeStringResponse(res, 401, content);
			return;
		},

		// General 
		respondObject: function(res, object){
			writeStringResponse(res, 200, getFormattedJSON(object.toJson()));
		},

		respondObjects: function(res, objects){
			var response = '';
			var respObjects = [];
			for(i in objects)
				respObjects.push(mask(objects[i].toJson(), response));
			writeStringResponse(res, 200, getFormattedJSON(respObjects));
		},

		sendOK: function(res, msg){
			log("Sending ok: " + msg);
			var content = getFormattedJSON({
				message: msg
			});
			writeStringResponse(res, 200, content);
			return;
		}
	}
};