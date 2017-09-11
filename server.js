require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

var https = require('https');
var fs = require('fs');

var options = {
    cert: fs.readFileSync('./cert/www-validador-es.crt'),
    key: fs.readFileSync('./cert/www-validador-es.key')
};

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

app.all('/*', function (req, res, next){
 const isNotSecure = (!req.get('x-forwarded-port') && req.protocol !== 'https') ||
      parseInt(req.get('x-forwarded-port'), 10) !== 443

    if (isNotSecure) {
      return res.redirect('https://' + req.get('host') + req.url)
    }

next()
}); // at top of routing calls


process.on('SIGINT', function () {
	  console.log('Recibido SIGINT.  Haz Control-D para salir.');
	});

//var server = app.listen(80, function () {
//    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
//});
app.listen(80);
https.createServer(options, app).listen(443);


