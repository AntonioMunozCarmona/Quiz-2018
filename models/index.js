const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// Configurar url a sQlite o Progress
const url = process.env.DATABASE_URL || 'sqlite:quiz.sqlite';

// Para usar la Base de Datos SQLite
const sequelize = new Sequelize(url);

// Para importar la definición de la tabla quiz desde quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Session
sequelize.import(path.join(__dirname, 'session'));

// Crear tablas
sequelize.sync()
    .then(() => console.log('DataBases creadas satisfactoriamente'))
    .catch( error => {
      console.log('Error creando las tablas de la Base de Datos', error);
      process.exit(1);
        
    });

module.exports = sequelize;
