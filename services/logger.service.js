var config = require('config.json');
var userService = require('services/user.service');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('logs');

var Q = require('q');
var service = {};

service.insert = insert;
service.find = find;

module.exports = service;

function insert(log) {
	 var deferred = Q.defer();
	 
	 db.logs.insert(
			 log,
			 function(err,doc)
			 {
				 if (err) deferred.reject(err.name + ': ' + err.message);
				 
				 deferred.resolve();
			 });
	 return deferred.promise;
}


function find(log)
{
	 var deferred = Q.defer();
	 db.logs.find(
			 log, 
			 function(err,doc)
			 {
				 if (err) deferred.reject(err.name + ': ' + err.message);
			 });
	 return deferred.promise;
}



