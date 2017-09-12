var SelfReloadJSON = require('self-reload-json');

var config = new SelfReloadJSON('config.json');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind(config.identification);
var Q = require('q');
var service = {};


service.findOne = findOne;

module.exports = service;


function findOne(id)
{
	
	console.log(config.identification);
	 var deferred = Q.defer();
	 db.collection(config.identification).findOne({ CIF_NIF: id }, 
			 function(err,result)
			 {
				 if (err) deferred.reject(err.name + ': ' + err.message);
				 
				 deferred.resolve(result);
			 });
	 return deferred.promise;
}