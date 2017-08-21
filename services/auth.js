var jwt    = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config');

module.exports = {
  authenticate: function(req, res) {
    User.findOne({
      name: req.body.name
    }, function(err, user) {

      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'User not found' });
      } else if (user) {

        user.validPassword(req.body.password, function(err, data) {

          if (err) throw err;

          if (!data) {
            res.json({ success: false, message: 'Password is not correct' });
          } else {

            var token = jwt.sign(user, config.secret, {
              expiresIn: '1440m'
            });

            res.json({
              success: true,
              token: token
            });
          }
        });
      }
    });
  },

  verifyToken: function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['access-token'];

    if (token) {

      jwt.verify(token, config.secret, function(err) {

        if (err) {
          return res.json({ success: false, message: 'Failed to authencticate token' });
        } else {
          next();
        }
      })
    } else {
      res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  }
}