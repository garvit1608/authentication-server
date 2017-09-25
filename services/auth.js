/**
* @file Defines auth serivce
*/

var jwt    = require('jsonwebtoken');
var User = require('../models/user');
var config = require('../config/config');
var Responder = require('./responder');

module.exports = {

 /**
  *  Signup end point
  *
  *  @param {object} request
  *  @param {object} response
   * @return {object} success/error
  */

  signup: function(req, res) {
    var params = req.body;
    console.log(params);
    var user = new User(params);

    user.save(function(err) {
      if (err) {
        Responder.error(res, err);
      } else {
        Responder.success(res, {
          success: true
        });
      }
    });
  },

  /**
   *  Generates JWT Token
   *
   *  @param {object} request
   *  @param {object} response
   *  @return {object} token
   */

  authenticate: function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {

      if (err) {
        Responder.error(res, err);
      }

      if (!user) {
        res.json({ success: false, message: 'User not found' });
      } else if (user) {

        user.validPassword(req.body.password, function(err, data) {

          if (err) throw err;

          if (!data) {
            res.json({ success: false, message: 'Password is not correct' });
          } else {

            var token = jwt.sign({user: user}, config.secret, {
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

  /**
   *  Verifies JWT token request
   *
   *  @param {object} request
   *  @param {object} response
   *  @param {function} next middleware
   *  @return {object} decoded token/error
   */


  verifyToken: function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['access-token'];

    if (token) {

      jwt.verify(token, config.secret, function(err, decoded) {

        if (err) {
          return res.json({ success: false, message: 'Failed to authencticate token' });
        } else {
          req.user = decoded.user;
          next();
        }
      })
    } else {
      res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  },

  /**
   *  Generates JWT token for authentication via Google
   *
   *  @param {object} response
   *  @param {object} payload
   *  @return {object} token
   */


  generateJwtToken: function(res, user) {

    var token = jwt.sign({user: user}, config.secret, {
      expiresIn: '1440m'
    });

    res.json({
      success: true,
      token: token
    });
  }
}