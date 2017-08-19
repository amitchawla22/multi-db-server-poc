var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET customers listing. */
router.get('/', function(req, res, next) {
  db.models(req.db, 'customer').findAll()
  .then((response) => {
    console.log("customer response", response);
    res.json(response);
  });
});

/* POST customers listing. */
router.post('/', function(req, res, next) {
  db.models(req.db, 'customer').create({
    name: req.body.name
  })
  .then((response) => {
    console.log("customer response", response);
    res.json(response);
  });
});

module.exports = router;
