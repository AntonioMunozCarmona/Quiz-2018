'use strict';

var crypt = require('../helpers/crypt');

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
    return queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: crypt.encryptPassword('1234', 'aaaa'),
        salt: 'aaaa',
        isAdmin: true,
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        username: 'pepe',
        password: crypt.encryptPassword('5678', 'bbbb'),
        salt: 'bbbb',
        isAdmin: false,
        createdAt: new Date(), updatedAt: new Date()
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
    return queryInterface.bulkDelete('users', null, {});
  }
};
