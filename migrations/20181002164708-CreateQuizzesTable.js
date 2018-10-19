'use strict';

// Este fichero lo creamos desde el prompt con:
// .\node_modules\.bin\sequelize migration:create --name CreateSessionsTable

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('sessions',
      {
        sid: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        expires: {
          type: Sequelize.DATE
        },
        data: {
          type: Sequelize.STRING(5000)
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      },
      {
        sync: {force: true}
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('sessions');
  }
};
