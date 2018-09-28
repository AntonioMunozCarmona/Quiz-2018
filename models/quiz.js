// Model

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('quiz', 
    {
      question: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg:'Question must not be empty'}}
      },
      answer: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg:'Answer must not be empty'}}
      }
    });
};

// Anterior para trabajar con el array
// let nextId = quizzes.length + 1;

// // Creates new quiz with the values passed
// exports.create = (quiz) => {
//   const newQuiz = {
//     id: nextId++,
//     question: (quiz.question || '').trim(),
//     answer: (quiz.answer || '').trim() 
//   };
//   quizzes.push(newQuiz);
//   return newQuiz;
// };

// // Updates a quiz with the values passed
// exports.update = (quiz) => {
//   const index = quizzes.findIndex( q => quiz.id === q.id );
//   if ( index >= 0 ) {
//     quizzes[index] = {
//       id: quiz.id,
//       question: (quiz.question || '').trim(),
//       answer: (quiz.answer || '').trim() 
//     };
//   }
// };

// // Returned all the quizzes
// exports.findAll = () => quizzes;

// // Find a quiz by its Id
// exports.findById = (id) => {
//   return quizzes.find( quiz => quiz.id === id );
// };

// // Remove the given quiz
// exports.destroy = (quiz) => {
//   const index = quizzes.findIndex( q => quiz.id === q.id );
//   if ( index >= 0 ) {
//     quizzes.splice(index,1);
//   }
// };
