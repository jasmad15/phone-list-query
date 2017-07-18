var config = require('config.json');
var userService = require('services/user.service');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('logs');
var json2csv = require('json2csv');
var iconv = require('iconv-lite');
var fs = require('fs');
var Q = require('q');
var service = {};

service.insert = insert;
service.find = find;
service.exportToCsv = exportToCsv;

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

	db.logs.find(log).toArray(function(err, logs){
		if (err){
			deferred.reject(err.name + ': ' + err.message);
		}

		if (logs) {

			deferred.resolve(logs);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function exportToCsv(log)
{
	var deferred = Q.defer();
	var queryLog = new Object();

	if (log.dateFrom && log.dateTo)
	{
		//queryLog.date = $gte:ISODate("2013-11-19T14:00:00Z"), $lt: ISODate("2013-11-19T20:00:00Z")
		queryLog.date = {$gte: new Date(log.dateFrom), $lt: new Date(log.dateTo)};
	}
	
	if (log.username)
	{
		queryLog.username = log.username;
	}
	var fields;
	var fieldNames;
	console.log(queryLog);
	if (log.type == 0)
	{
		fields = ['yearMonthDay', 'desc', 'username' ];
		fieldNames = ['Fecha', 'Descripci\u00f3n', "Usuario"];
		queryLog.action = "BUSQUEDA_NUMERO_EXITO";
		
	}else
	{
		fields = ['yearMonthDay', 'username' ];
		fieldNames = ['Fecha', "Usuario"];
		queryLog.action = "INICIO_SESION_EXITO";
	}

	try {
		
		db.logs.aggregate([{ $match:queryLog}, {$project: {yearMonthDay: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$date" } }, desc:1, username:1 } }],function(err, logs){
			if (err){
				deferred.reject(err.name + ': ' + err.message);
			}

			if (logs) {
				var csv  = json2csv({ data: logs, fields: fields, fieldNames: fieldNames, del: ';' });
				var timeStampInMs = Date.now();
				var fileName = 'logs_' + timeStampInMs + '.csv';
				fs.writeFile(process.cwd() + '/app/reports/' +fileName,csv, {encoding: 'latin1'}, function(err) {
					if (err){
						deferred.reject(err.name + ': ' + err.message);
					}
					deferred.resolve('./reports/'+fileName);	
				}); 
			}
		});

		
		/*
		db.logs.find(queryLog).toArray(function(err, logs){
			if (err){
				deferred.reject(err.name + ': ' + err.message);
			}

			if (logs) {
				var csv  = json2csv({ data: logs, fields: fields, fieldNames: fieldNames, del: ';' });
				var timeStampInMs = Date.now();
				var fileName = 'logs_' + timeStampInMs + '.csv';
				fs.writeFile(process.cwd() + '/app/reports/' +fileName,csv, {encoding: 'latin1'}, function(err) {
					if (err){
						deferred.reject(err.name + ': ' + err.message);
					}
					deferred.resolve('./reports/'+fileName);	
				}); 
			}
		});
		*/
	} catch (err) {

			deferred.reject(err.name + ': ' + err.message);
	}

	return deferred.promise;

}



