var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* Author page*/
router.get('/author', function(req, res, next) {
  res.render('author', { nombre: 'Antonio', ape: 'Muñoz' });
});

module.exports = router;
