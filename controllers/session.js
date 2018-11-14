const Sequelize = require('sequelize');
const { models } = require('../models');
const url = require('url');

const maxIdleTime = 5*60*1000;  // Tiempo maximo de sesion inactivo 5 min

// Funcion de autenticación
const authenticate = ( login, password) => {
  return models.user.findOne({where: {username: login}})
    .then( user => {
      if ( user && user.verifyPassword(password)) {
        return user;
      } else {
        return null;
      }
    });
};

exports.deleteExpiredUserSession = ( req, res, next) => {

  if ( req.session.user ) {   // Si existe la sessión de usuario
    if ( req.session.user.expires < Date.now() ) {  // Expirado
      delete req.session.user; // logout
      req.flash('info', 'La sessión de usuario ha caducado');
    } else {
      req.session.user.expires = Date.now() + maxIdleTime;
    }
  }
  next();
};

// GET /session => Login form
exports.new = ( req, res, next) => {
  let redir = req.query.redir || url.parse(req.headers.referer || '/').path;

  // No mostrar el formulario de login otra vez
  if (redir === '/session') {
    redir = '/';
  }
  res.render('session/new', {redir});
};

// POST /session  ==> Crea la sesión si user esta autenticado
exports.create = ( req, res, next ) => {
  const redir = req.body.redir || '/';

  const login = req.body.login;
  const password = req.body.password;

  authenticate(login, password)
    .then( user => {
      console.log('user', user);
      
      if ( user ) {   // La existencia de req.session.user indica que la session existe
        req.session.user = {
          id: user.id,
          username: user.username,
          expires: Date.now() + maxIdleTime
        };
        res.redirect(redir);
      } else {
        req.flash('error', 'Authentication has failed. Retry it again.');
        res.render('session/new', {redir});
    }
    })
    .catch( error => {
      req.flash('error', `An error has ocurred: ${error}`);
      next(error);
    });
};

exports.destroy = ( req, res, next ) => {
  delete req.session.user;

  res.redirect('/session');
};



