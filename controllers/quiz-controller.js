const models = require('../models');

// Autoload de el quiz asociado a :quizId
// De esta forma se busca el quiz y se autocarga
// Para simplificar el resto de controladores
exports.load = (req, res, next, quizId) => {
  const quiz = models.quiz.findById(Number(quizId));

  if ( quiz ) {
    req.quiz = quiz;
    next();
  } else {
    throw new Error(`No hay Quiz con Número de ID: ${quizId}`);
  }
};

// GET /quizzes
exports.index = (req, res, next) => {
  const quizzes = models.quiz.findAll();

  res.render('quizzes/index.ejs', { quizzes });
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
  let quiz = {
    question: req.body.question,
    answer: req.body.answer
  };

  // Validates that they are not empty
  if ( !quiz.question || !quiz.answer) {
    res.render('/quizzes/new', {quiz});
    return;
  }

  // Saves the new Quiz
  quiz = models.quiz.create(quiz);
  res.redirect(`/quizzes/${quiz.id}`);
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

  models.quiz.update(quiz);
    
  // res.redirect('/quizzes');
  res.render('quizzes/show', {quiz});
};

// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {
  
  models.quiz.destroy(req.quiz);

  res.redirect('/quizzes');
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
