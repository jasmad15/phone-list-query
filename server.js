
require('rootpath')();

var lex = require('greenlock-express').create({
	  // set to https://acme-v01.api.letsencrypt.org/directory in production
	  server: 'staging'

	// If you wish to replace the default plugins, you may do so here
	//
	, challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) }
	, store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' })

	// You probably wouldn't need to replace the default sni handler
	// See https://git.daplie.com/Daplie/le-sni-auto if you think you do
	//, sni: require('le-sni-auto').create({})

	, approveDomains: approveDomains
	});

//handles acme-challenge and redirects to https
require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
console.log("Listening for ACME http-01 challenges on", this.address());
});

var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var helmet = require('helmet');


app.use(helmet());


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

//handles your app
require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});

/*
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
*/


