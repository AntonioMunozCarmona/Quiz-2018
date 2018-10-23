var express = require('express');
var router = express.Router();

const quizController = require('../controllers/quiz');
const tipController = require('../controllers/tip');

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

// Routes for the resource /quizzes
router.get('/quizzes', quizController.index);
router.get('/quizzes/:quizId(\\d+)', quizController.show);
router.get('/quizzes/new', quizController.new);
router.post('/quizzes', quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizzes/:quizId(\\d+)', quizController.update);
router.delete('/quizzes/:quizId(\\d+)', quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play', quizController.play);
router.get('/quizzes/:quizId(\\d+)/check', quizController.check);

router.post('/quizzes/:quizId(\\d+)/tips', tipController.create);

module.exports = router;
