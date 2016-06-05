var mask = require('json-mask');

var HELPERS = require(ROOT + '/helpers/general.js');
var log = HELPERS.log;

function getFormattedJSON(myObject){
	return JSON.stringify(myObject, null, 4) + '\n';
};

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
}

module.exports = function (objectType) {
	return {

		// Login 
		sendLoginOK: function(res, message) {
			var content = getFormattedJSON({
				username: message.toString(),
			});
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
			log("Error occured: " + error.toString);
			var errorMsg = error ? error.toString() : "No error detail.";
			writeStringResponse(res, 401, errorMsg);
		},

		sendFail: function(res, message) {
			log("Fail occured: " + message.toString);
			var content = getFormattedJSON({
				message: message.toString(),
			});
			writeStringResponse(res, 401, content);
			return;
		}
	}
};