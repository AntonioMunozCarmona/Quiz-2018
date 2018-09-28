const Sequelize = require('sequelize');
const {models} = require('../models');

// Autoload de el quiz asociado a :quizId
// De esta forma se busca el quiz y se autocarga
// Para simplificar el resto de controladores
exports.load = (req, res, next, quizId) => {
  models.quiz.findById(Number(quizId))
    .then( quiz => {
      if ( quiz ) {
        req.quiz = quiz;
        next();
      } else {
        throw new Error(`No hay Quiz con Número de ID: ${quizId}`);
      }
    })
    .catch(error => next(error));
};

// GET /quizzes
exports.index = (req, res, next) => {
  models.quiz.findAll()
    .then( quizzes => {
      res.render('quizzes/index.ejs', { quizzes });
    })
    .catch(error => next(error));
  
};

// GET /quizzes/:quizId
exports.show = (req, res, next) => {
  
  const {quiz} = req;

  res.render('quizzes/show', {quiz});
};

// GET /quizzes/new
exports.new = (req, res, next) => {
  const quiz = {
    question: '',
    answer: ''
  };
  res.render('quizzes/new', {quiz});
};

// POST /quizzes/create
exports.create = (req, res, next) => {

  const {question, answer} = req.body;
  const quiz = models.quiz.build({
    question,
    answer
  });

  // Salva solo los campos question y answer en la BBDD
  quiz.save({fields: ['question', 'answer']})
    .then( quiz => res.redirect(`/quizzes/${quiz.id}`))
    .catch(Sequelize.ValidationError, error => {
      console.log('Hay errores en el formulario');
      error.errors.forEach(({message}) => console.log(message));
      res.render('quizzes/new', {quiz});
    })
    .catch( error => next(error));
};

// GET /quizzes/:quizId/edit
exports.edit = (req, res, next) => {
  
  const {quiz} = req;

  res.render('quizzes/edit', {quiz});
};

// PUT /quizzes/:quizId
exports.update = (req, res, next) => {
  
  const {quiz, body} = req;

  quiz.question = body.question;
  quiz.answer = body.answer;

  quiz.save({fields: ['question', 'answer']})
  // Podríamos mandar al listado general o listar solo el quiz
  // res.redirect('/quizzes'); 
    .then( quiz => res.render('quizzes/show', {quiz} ))
    .catch(Sequelize.ValidationError, error => {
      console.log('Hay errores en el formulario');
      error.errors.forEach(( {message}) => console.log(message));
      res.render('quizzes/edit',{quiz});     
    })
    .catch( error => next(error));
};

// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {
  
  req.quiz.destroy()
    .then(() => res.redirect('/quizzes'))
    .catch(error => next(error));
};

// GET /quizzes/play
exports.play = (req, res, next) => {

  const {quiz, query} = req;
  const answer = query.answer || '';

  res.render('quizzes/play', {
    quiz: quiz,
    answer: answer
  });
};

// GET /quizzes/:quizId/check
exports.check = (req, res, next) => {
  
  const {quiz, query} = req;
  const answer = query.answer || '';

  const result = answer.toLowerCase().trim() === quiz.answer.toLowerCase().trim();

  res.render('quizzes/result', {
    quiz: quiz,
    result: result,
    answer: answer
  });
};
