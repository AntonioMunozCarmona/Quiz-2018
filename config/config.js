module.exports = {
  development: {
    storage: 'quiz.sqlite',
    dialect: 'sqlite'
  },
  test: {
    username: 'database_test',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    connection: process.env.DATABASE_URL,
    dialectOptions: {
      ssl: true
    }
  }
};
