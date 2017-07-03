require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));


app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));


app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));
//faltan los de logs y la consulta

//ficheros estaticos ESTO
app.use(express.static('public'));

app.use(function (err, req, res, next) {
	  if (err.name === 'UnauthorizedError') {
	    res.status(401).send('Sesión no valida, por favor vuelva a iniciar sesión');
	  }
	});

app.get('/', function (req, res) {
    return res.redirect('/app');
});


process.on('SIGINT', function () {
	  console.log('Recibido SIGINT.  Haz Control-D para salir.');
	});

var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});