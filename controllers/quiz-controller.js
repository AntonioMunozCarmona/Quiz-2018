const Sequelize = require('sequelize');
const {models} = require('../models');

const paginate = require('../helpers/paginate').paginate;

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
  models.quiz.count()
    .then( count => {
      // Pagination

      const itemsPerPage = 10;

      // La página a mostrar es dada en el query
      const pageno = parseInt(req.query.pageno) || 1;

      // Crear una cadena con el HTML usado para renderizar los botones de paginación
      // Esta cadena es añadida a una variable local de res, que es usada en el fichero 
      // application layout
      res.locals.paginateControl = paginate(count, itemsPerPage, pageno, req.url);

      const findOptions = {
        offset: itemsPerPage * (pageno - 1),
        limit: itemsPerPage
      };
      return models.quiz.findAll(findOptions);

    })
    .then(quizzes => {
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
    .then( quiz => {
      req.flash('success', 'Quiz creado satisfactoriamente');
      res.redirect(`/quizzes/${quiz.id}`);
    })
    .catch(Sequelize.ValidationError, error => {
      req.flash('error', 'Hay errores en el formulario');
      error.errors.forEach(({message}) => req.flash('error', message));
      res.render('quizzes/new', {quiz});
    })
    .catch( error => {
      req.flash('error', 'Error creando un nuevo Quiz' + error.message);
      next(error);
    });
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
    .then( quiz => {
      req.flash('success', 'Quiz Editado Satisfactoriamente');
      res.render('quizzes/show', {quiz} );
    })
    .catch(Sequelize.ValidationError, error => {
      req.flash('error', 'Hay errores en el formulario');
      error.errors.forEach(( {message}) => req.flash('error', message));
      res.render('quizzes/edit',{quiz});     
    })
    .catch( error => {
      req.flash('error', 'Error editando el Quiz' + error.message);
      next(error);
    });
};

// DELETE /quizzes/:quizId
exports.destroy = (req, res, next) => {
  
  req.quiz.destroy()
    .then(() => {
      req.flash('success', 'Quiz borrado satisfactoriamente');
      res.redirect('/quizzes');
    })
    .catch(error => {
      req.flash('Error', `Error borrando el Quiz &{error.message}`);
      next(error);
    });
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
