var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var partials = require('express-partials');
var flash = require('express-flash');
var methodOverride = require('method-override');

// Rutas
var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// Configuración de Session para ser almacenada en DB con Sequelize
var sequelize = require('./models');
var sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'session',
  checkExpirationInterval: 15 * 60 * 1000,  // Limpia las sesiones expiradas cada 15 minutos
  expiration: 4 *60 * 60 *1000  // 4 horas de duracion máxima de sessión
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Uso de la session
app.use(session({
  secret: 'el secreto de la pirámide',
  store: sessionStore,
  resave: false,
  saveUninitialized: true
}));

app.use(methodOverride('_method',{methods: ['POST', 'GET']}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(flash());

// Dynamic Helper
app.use(function (req, res, next) {
  // Para usar req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use('/', routes);
// app.use('/users', users); La creo express pero no la usaremos

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
