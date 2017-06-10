
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind(process.env.PHONE_LIST);
var Q = require('q');
var service = {};


service.findOne = findOne;

module.exports = service;


function findOne(phoneNumber)
{
	 var deferred = Q.defer();
	 db.logs.findOne(
			 {number:phoneNumer}, 
			 function(err,doc)
			 {
				 if (err) deferred.reject(err.name + ': ' + err.message);
			 });
	 return deferred.promise;
}
