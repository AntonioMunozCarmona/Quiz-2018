const path = require('path');

// Load ORM
const Sequelize = require('sequelize');

// Configurar url a sQlite o Progress
const url = process.env.DATABASE_URL || 'sqlite:quiz.sqlite';

// Para usar la Base de Datos SQLite
const sequelize = new Sequelize(url);

// Para importar la definición de la tabla quiz desde quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Para importar la definición de la tabla de Tips desde tip.js
sequelize.import(path.join(__dirname, 'tip'));

// Importar la definicion (el modelo) de user desde user.js
sequelize.import(path.join(__dirname, 'user'));

// Session
sequelize.import(path.join(__dirname, 'session'));

// Crear tablas
// sequelize.sync()
//     .then(() => console.log('DataBases creadas satisfactoriamente'))
//     .catch( error => {
//       console.log('Error creando las tablas de la Base de Datos', error);
//       process.exit(1);
        
//     });

const { quiz, tip, user} = sequelize.models;

tip.belongsTo(quiz);
quiz.hasMany(tip);

user.hasMany(quiz, {foreignKey: 'authorId'});
quiz.belongsTo(user, {as: 'author', foreignKey: 'authorId'});

module.exports = sequelize;
