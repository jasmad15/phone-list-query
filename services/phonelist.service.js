var config = require('config.json');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
//db.bind(process.env.PHONE_LIST);
db.bind('listin');
var Q = require('q');
var service = {};


service.findOne = findOne;

module.exports = service;


function findOne(phoneNumber)
{
	 var deferred = Q.defer();
	 db.listin.findOne({ NVOMSISDN: parseInt(phoneNumber) }, 
			 function(err,result)
			 {
				 if (err) deferred.reject(err.name + ': ' + err.message);
				 
				 deferred.resolve(result);
			 });
	 return deferred.promise;
}
