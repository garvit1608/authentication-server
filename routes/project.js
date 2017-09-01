var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var authService = require('../services/auth');
var Responder = require('../services/responder');
var Project = require('../models/project');

router.use(authService.verifyToken);

router.post('/add', function(req, res, next) {
  var params = req.body;
  var project = new Project(params);
  project.save(function(err, p) {
    if(err) {
      Responder.error(res, err);
    } else {
      Responder.success(res, p);
    }
  });
});

router.get('/list', function(req, res, next) {
  var owner = req.user;

  Project.find({ owner: owner }, function(err, project) {
    if(err) {
      Responder.error(res, err);
    } else {
      Responder.success(res, project);
    }
  });
});


module.exports = router;
