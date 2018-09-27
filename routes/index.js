var express = require('express');
var router = express.Router();

const quizController = require('../controllers/quiz-controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* Author page*/
router.get('/author', function(req, res, next) {
  res.render('author', { nombre: 'Antonio', ape: 'Muñoz' });
});

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

module.exports = router;
