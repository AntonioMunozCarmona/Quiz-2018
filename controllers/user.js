const Sequelize = require('sequelize');
const {models} = require('../models');

const paginate = require('../helpers/paginate').paginate;

// Autoload the user with id equals to :userId
exports.load = (req, res, next, userId) => {

  models.user.findById(userId)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        req.flash('error', `There is no user with id=${userId}.`);
        throw new Error(`No exist userId=${userId}`);
      }
    })
    .catch(error => next(error));
};


// GET /users
exports.index = (req, res, next) => {

  models.user.count()
    .then(count => {

        // Pagination:

      const itemsPerPage = 10;

        // The page to show is given in the query
      const pageno = parseInt(req.query.pageno) || 1;

      // Create a String with the HTMl used to render the pagination buttons.
      // This String is added to a local variable of res, which is used into the application layout file.
      res.locals.paginateControl = paginate(count, itemsPerPage, pageno, req.url);

      const findOptions = {
        offset: itemsPerPage * (pageno - 1),
        limit: itemsPerPage,
        order: ['username']
      };

      return models.user.findAll(findOptions);
    })
    .then(users => {
      res.render('users/index', {users});
    })
    .catch(error => next(error));
};

// GET /users/:userId
exports.show = (req, res, next) => {

  const {user} = req;

  res.render('users/show', {user});
};


// GET /users/new
exports.new = (req, res, next) => {

  const user = {
    username: '',
    password: ''
  };

  res.render('users/new', {user});
};


// POST /users
exports.create = (req, res, next) => {

  const {username, password} = req.body;

  const user = models.user.build({
    username,
    password
  });

    // Save into the data base
  user.save({fields: ['username', 'password', 'salt']})
    .then(user => { // Render the users page
      req.flash('success', 'User created successfully.');
      if ( req.session.user ) {
        res.redirect(`/users/${user.id}`);

      } else {
        res.redirect('/session');   // Redirección a la página de login
      }
    })
    .catch(Sequelize.UniqueConstraintError, error => {
      req.flash('error', `User "${username}" already exists.`);
      res.render('users/new', {user});
    })
    .catch(Sequelize.ValidationError, error => {
      req.flash('error', 'There are errors in the form:');
      error.errors.forEach(({message}) => req.flash('error', message));
      res.render('users/new', {user});
    })
    .catch(error => next(error));
};


// GET /users/:userId/edit
exports.edit = (req, res, next) => {

  const {user} = req;

  res.render('users/edit', {user});
};


// PUT /users/:userId
exports.update = (req, res, next) => {

  const {user, body} = req;

  // user.username  = body.user.username; // edition not allowed
  user.password = body.password;

  // Password can not be empty
  if (!body.password) {
    req.flash('error', 'Password field must be filled in.');
    return res.render('users/edit', {user});
  }

  user.save({fields: ['password', 'salt']})
    .then(user => {
      req.flash('success', 'User updated successfully.');
      res.redirect(`/users/${user.id}`);
    })
    .catch(Sequelize.ValidationError, error => {
      req.flash('error', 'There are errors in the form:');
      error.errors.forEach(({message}) => req.flash('error', message));
      res.render('users/edit', {user});
    })
    .catch(error => next(error));
};


// DELETE /users/:userId
exports.destroy = (req, res, next) => {

  req.user.destroy()
    .then(() => {
      if ( req.session.user && req.session.user.id === req.user.id ) {
        delete req.session.user;
      }
      req.flash('success', 'User deleted successfully.');
      res.redirect('/goback');
    })
    .catch(error => next(error));
};
