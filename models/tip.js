// Definición del modelo de tip

module.exports = function (sequelize, Datatypes) {
  return sequelize.define('tip', {
    text: {
      type: Datatypes.STRING,
      validate: { notEmpty: { msg: 'Tip text must not be empty '}}
    }
  });
};
