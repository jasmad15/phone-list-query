var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var logger = require('services/logger.service');
var phoneList = require('services/phonelist.service');

//routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.post('/find', findUsers);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.post('/findNumber', findNumber);

module.exports = router;

function authenticateUser(req, res) {
	userService.authenticate(req.body.username, req.body.password)
	
	.then(function (token) {
		if (token) {
			writeUserLog(req,res,'INICIO_SESION_EXITO',req.body.username);
			res.send({ token: token });
			
		} else {
			writeUserLog(req,res,'INICIO_SESION_ERROR',req.body.username);
			res.status(401).send('El usuario o contraseña no es correcta');
		}
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function registerUser(req, res) {
	userService.create(req.body)
	.then(function () {
		writeUserLog(req,res,'ALTA_USUARIO', req.body.username);
		res.sendStatus(200);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function findUsers(req, res) {
	userService.getByFilter(req.body)
	.then(function (users) {
		writeUserLog(req,res,'BUSQUEDA_USUARIO', null);
		res.status(200).send(users);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function findNumber(req, res) {
	phoneList.findOne(req.body.NVOMSISDN)
	.then(function (result) {
		writeUserLog(req,res,'BUSQUEDA_NUMERO', null);
		res.status(200).send(result);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function getCurrentUser(req, res) {
	userService.getById(req.user.sub)
	.then(function (user) {
		if (user) {
			res.send(user);
		} else {
			res.sendStatus(404);
		}
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}


function writeUserLog(req, res, action, username)
{
	if (username == null)
	{
		userService.getById(req.user.sub).then(function (user) {
			if (user) {
				
				var log = new Object();
				log.date = new Date();
				log.action = action
				log.username = user.username;
				logger.insert(log);
			} 			
		})
		.catch(function (err) {
			//que hacemos aquí...
			res.status(400).send(err.message);
		});
	}else
	{
		var log = new Object();
		log.date = new Date();
		log.action = action
		log.username = username;
		logger.insert(log);
	}
}

function updateUser(req, res) {

	userService.getById(req.user.sub).then(function (user) {
		if (user) {
			if (user.profile != 1 && user.createdBy == req.body.createBy) {
				return res.status(401).send('You can only update your own account');
			}
			userService.update(userId, req.body)
			.then(function () {
				writeUserLog(req,res,'ACTUALIZACION_USUARIO', null);
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
		} else {
			res.sendStatus(404);
		}
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
	
	
}

function deleteUser(req, res) {
	var userId = req.params._id;
	
	userService.delete(userId)
	.then(function () {
		writeUserLog(req,res,'BORRADO_USUARIO',null);
		res.sendStatus(200);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}