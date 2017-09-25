var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Responder = require('../services/responder');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Creates dummy admin
 */

router.get('/setup', function(req, res) {
  var user = new User({
    username: 'garvit.v',
    name: 'Garvit',
    password: 'password',
    admin: true
  });

  user.save(function(err) {
    if (err) {
      Responder.error(res, err);
    } else {
      console.log('User saved successfully');
      Responder.success(res, { success: true });
    }

  });
});

module.exports = router;
