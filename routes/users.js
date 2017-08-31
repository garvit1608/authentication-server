var express = require('express');
var router = express.Router();
var User = require('../models/user');
var authService = require('../services/auth');
var Responder = require('../services/responder');

router.use(authService.verifyToken);

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    Responder.success(res, users);
  });
});

module.exports = router;
