'use strict';

// Se crea desde el prompt con:
// .\node_modules\.bin\sequelize seed:create --name FillQuizzesTable

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('quizzes', [
      {
        question: 'Capital de Italia',
        answer: 'Roma',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Francia',
        answer: 'París',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Portugal',
        answer: 'Lisboa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question: 'Capital de Austria',
        answer: 'Viena',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('quizzes', null, {});
  }
};
