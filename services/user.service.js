var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getByFilter = getByFilter;
service.getListAgencies = getListAgencies;

module.exports = service;

function authenticate(username, password) {
	var deferred = Q.defer();
	// deferred.resolve(jwt.sign({ sub: 123456 }, config.secret));

	db.users.findOne({ username: username }, function (err, user) {
		if (err) deferred.reject(err.name + ': ' + err.message);

		if (user && bcrypt.compareSync(password, user.hash)) {
			// authentication successful
			deferred.resolve(jwt.sign({ sub: user._id }, config.secret, { expiresIn: '1h' }));
		} else {
			// authentication failed
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getById(_id) {
	var deferred = Q.defer();

	db.users.findById(_id, function (err, user) {
		if (err) deferred.reject(err.name + ': ' + err.message);

		if (user) {

			deferred.resolve(_.omit(user, 'hash'));
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getByFilter(_user) {
	var deferred = Q.defer();

	if (_user.username)
	{
		_user.username = new RegExp(_user.username, "i");
	}
	if (_user.firstName)
	{
		_user.firstName = new RegExp(_user.firstName, "i");
	}
	if (_user.lastName)
	{
		_user.lastName = new RegExp(_user.lastName, "i");
	}
	db.users.find(_user).toArray(function(err, users){
		if (err){
			deferred.reject(err.name + ': ' + err.message);
		}

		if (users) {

			deferred.resolve(users);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
}

function getListAgencies()
{
	var deferred = Q.defer();

	db.users.distinct("agencia", function(err, agencies){
		if (err){
			deferred.reject(err.name + ': ' + err.message);
		}

		if (agencies) {

			deferred.resolve(agencies);
		} else {
			deferred.resolve();
		}
	});
	
	return deferred.promise;
}

function create(userParam) {
	var deferred = Q.defer();


	db.users.findOne(
			{ username: userParam.username },
			function (err, user) {
				if (err) deferred.reject(err.name + ': ' + err.message);

				if (user) {
					deferred.reject('El usuario "' + userParam.username + '" ya esta dado de alta');
				} else {
					createUser();
				}
			});

	function createUser() {

		var user = _.omit(userParam, 'password');

		user.hash = bcrypt.hashSync(userParam.password, 10);

		db.users.insert(
				user,
				function (err, doc) {
					if (err) deferred.reject(err.name + ': ' + err.message);

					deferred.resolve();
				});
	}

	return deferred.promise;
}

function update(userParam) {
	var deferred = Q.defer();

		// fields to update
		var set = {
				firstName: userParam.firstName,
				lastName: userParam.lastName,
				username: userParam.username,
		};

		// update password if it was entered
		if (userParam.password) {
			set.hash = bcrypt.hashSync(userParam.password, 10);
		}
		var _id = userParam._id;
		db.users.update(
				{ _id: mongo.helper.toObjectID(_id) },
				{ $set: set },
				function (err, doc) {
					if (err) deferred.reject(err.name + ': ' + err.message);

					deferred.resolve();
				});
	

	return deferred.promise;
}

function _delete(_id) {
	var deferred = Q.defer();

	db.users.remove(
			{ _id: mongo.helper.toObjectID(_id) },
			function (err) {
				if (err) deferred.reject(err.name + ': ' + err.message);

				deferred.resolve();
			});

	return deferred.promise;
}