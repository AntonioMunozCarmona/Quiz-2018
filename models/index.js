const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// Para usar la Base de Datos SQLite
const sequelize = new Sequelize('sqlite:quiz.sqlite');

// Para importar la definición de la tabla quiz desde quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Crear tablas
sequelize.sync()
    .then(() => console.log('DataBases creadas satisfactoriamente'))
    .catch( error => {
      console.log('Error creando las tablas de la Base de Datos', error);
      process.exit(1);
        
    });

module.exports = sequelize;
