var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var logger = require('services/logger.service');
var phoneList = require('services/phonelist.service');
var identification = require('services/identification.service');
//routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.post('/find', findUsers);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.post('/findNumber', findNumber);
router.post('/listAgencies', getListAgencies);
router.post('/logging', getlogging);
router.post('/getCSVlog', getCSVlog);
router.post('/findId', findId);

module.exports = router;

function authenticateUser(req, res) {
	userService.authenticate(req.body.username, req.body.password)

	.then(function (token) {
		if (token) {
			writeUserLog(null,res,'INICIO_SESION_EXITO','el usuario ' + req.body.username + ' se ha logado correctamente', req.body.username);
			res.send({ token: token });

		} else {
			writeUserLog(null,res,'INICIO_SESION_ERROR', 'el usuario ' + req.body.username + ' ha tenido un login incorrecto',req.body.username);
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
		writeUserLog(null,res,'ALTA_USUARIO_EXITO', 'Se ha dado de alta al usuario ' + req.body.username + ' de alta correctamente', req.body.username);
		res.sendStatus(200);
	})
	.catch(function (err) {
		writeUserLog(null,res,'ALTA_USUARIO_ERROR', 'No se ha podido dar de alta al usuario ' + req.body.username + ' con error: ' + err, req.body.username);
		res.status(400).send(err);
	});
}

function findUsers(req, res) {
	userService.getByFilter(req.body)
	.then(function (users) {
		writeUserLog(users._id,res,'BUSQUEDA_USUARIO', null);
		res.status(200).send(users);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function getListAgencies(req, res) {
	userService.getListAgencies(req.body)
	.then(function (agencies) {
		res.status(200).send(agencies);
	})
	.catch(function (err) {
		res.status(400).send(err);
	});
}

function findNumber(req, res) {
	phoneList.findOne(req.body.NVOMSISDN)
	.then(function (result) {
		if (result)
		{
			writeUserLog(req.user.sub,res,'BUSQUEDA_NUMERO_EXITO' , 'Se ha consultado el numero: ' + req.body.NVOMSISDN + ' con resultado: ' + result.TIPO , null);
		}else
		{
			writeUserLog(req.user.sub,res,'BUSQUEDA_NUMERO_EXITO' , 'Se ha consultado el numero: ' + req.body.NVOMSISDN + ' con resultado: Número no encontrado' , null);
		}

		res.status(200).send(result);
	})
	.catch(function (err) {
		writeUserLog(req.user.sub, res,'BUSQUEDA_NUMERO_ERROR' , 'La consulta del número: ' + req.body.NVOMSISDN + ' ha terminado con error: ' + err , null);
		res.status(400).send(err);
	});
}

function findId(req, res) {
	identification.findOne(req.body.NVOMSISDN)
	.then(function (result) {
		if (result)
		{
			writeUserLog(req.user.sub,res,'BUSQUEDA_ID_EXITO' , 'Se ha consultado el NIF: ' + req.body.NVOMSISDN + ' con resultado: ' + result.TIPO , null);
		}else
		{
			writeUserLog(req.user.sub,res,'BUSQUEDA_ID_EXITO' , 'Se ha consultado el NIF: ' + req.body.NVOMSISDN + ' con resultado: Número no encontrado' , null);
		}

		res.status(200).send(result);
	})
	.catch(function (err) {
		writeUserLog(req.user.sub, res,'BUSQUEDA_ID_ERROR' , 'La consulta del NIF: ' + req.body.NVOMSISDN + ' ha terminado con error: ' + err , null);
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


function writeUserLog(userId, res, action, desc, username)
{
	if (username == null)
	{
		userService.getById(userId).then(function (user) {
			if (user) {

				var log = new Object();
				log.date = new Date();
				log.action = action
				log.desc = desc;
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
	userService.update(req.body)
	.then(function () {
		writeUserLog(req.user.sub,res,'ACTUALIZA_USUARIO_EXITO', 'Usuario '+ req.body.username + ' se ha actualizado con exito', null);
		res.sendStatus(200);
	})
	.catch(function (err) {
		writeUserLog(req.user.sub,res,'ACTUALIZA_USUARIO_ERROR', 'Eroor al actulaizar el usuario '+ req.body.username + ' con error: ' + err, null);
		res.status(400).send(err);
	});



}

function deleteUser(req, res) {
	var userId = req.params._id;

	userService.delete(userId)
	.then(function () {
		writeUserLog(userId,res,'BORRADO_USUARIO_EXITO', 'Borrado del usuario:  ' + userId + ' Con exito',null);
		res.sendStatus(200);
	})
	.catch(function (err) {
		writeUserLog(userId,res,'BORRADO_USUARIO_ERROR', 'Borrado del usuario:  ' + userId + ' Con error: ' + err,null);
		res.status(400).send(err);
	});
}

function getlogging(req, res) {
	logger.find(req.body) 
	.then(function (result) {
	
		if (result)
		{
			writeUserLog(req,res,'BUSQUEDA_LOGS_EXITO' , 'Se ha consultado las trazas correctamente ' , null);
		}else
			{
			writeUserLog(req,res,'BUSQUEDA_LOGS_ERROR' , 'Se ha consultado las trazas con error', null);
			}
			res.status(200).send(result);
	})
	.catch(function (err) {
		writeUserLog(req,res,'BUSQUEDA_LOGS_ERROR' , 'La consulta de trazas ha terminado con error: ' + err , null);
		res.status(400).send(err);
	});
}

function getCSVlog(req, res) {
	logger.exportToCsv(req.body) 
	.then(function (result) {
	
		if (result)
		{
			res.status(200).send(result);
		}
	})
	.catch(function (err) {
		writeUserLog(req,res,'BUSQUEDA_LOGS_ERROR' , 'La consulta de trazas ha terminado con error: ' + err , null);
		res.status(400).send(err);
	});
}
