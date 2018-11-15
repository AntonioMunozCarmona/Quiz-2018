var express = require('express');
var router = express.Router();

const quizController = require('../controllers/quiz');
const tipController = require('../controllers/tip');
const userController = require('../controllers/user');
const sessionController = require('../controllers/session');

/* Auto logout */
router.all('*', sessionController.deleteExpiredUserSession);

// Rutas de /goBack
function redirectBack ( req, res, next) {  // redirecciona a backURL
  const url = req.session.backURL || '/';
  delete req.session.backURL;
  res.redirect(url);
}
router.get('/goback', redirectBack);

function saveBack ( req, res, next) {  // Salva la URL desde la que venimos
  req.session.backURL = req.url;
  next();
}
router.get(['/', '/author', '/users', '/users/:id(\\d+)/quizzes', '/quizzes'], saveBack);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* Author page*/
router.get('/author', function(req, res, next) {
  res.render('author', { nombre: 'Antonio', ape: 'Muñoz' });
});

// Autoload para las routes usando :quizId (para que se pase como
// una variable mas y en todas las rutas que llevan :quizID lo pasará 
// al controlador como una variable mas)
router.param('quizId', quizController.load);
router.param('userId', userController.load);

// Rutas de Sessión
router.get('/session', sessionController.new);        // Formulario de Login
router.post('/session', sessionController.create);    // Crear session
router.delete('/session', sessionController.destroy); // Cerrar sessión

// Rutas para el recurso /users
router.get('/users', sessionController.loginRequired, userController.index);
router.get('/users/:userId(\\d+)', sessionController.loginRequired, userController.show);
router.get('/users/new', userController.new);
router.post('/users', userController.create);
router.get('/users/:userId(\\d+)/edit', sessionController.loginRequired, userController.edit);
router.put('/users/:userId(\\d+)', sessionController.loginRequired, userController.update);
router.delete('/users/:userId(\\d+)', sessionController.loginRequired, userController.destroy);

// Ruta para el recurso /users/:userId/quizzes => Relación 1 a N (Todos 
// los quizzes de un usuario)
router.get('/users/:userId(\\d+)/quizzes', sessionController.loginRequired, quizController.index);

// Routes for the resource /quizzes
router.get('/quizzes', quizController.index);
router.get('/quizzes/:quizId(\\d+)', quizController.show);
router.get('/quizzes/new', sessionController.loginRequired, quizController.new);
router.post('/quizzes', sessionController.loginRequired, quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizzes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizzes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play', quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

router.post('/quizzes/:quizId(\\d+)/tips', sessionController.loginRequired, tipController.create);

module.exports = router;
