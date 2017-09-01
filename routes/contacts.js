var Contact = require('../models/contact');
var Responder = require('../services/responder');

module.exports = {
  add: function(req, res, next) {
    var params = req.body;
    var contact = new Contact(params);

    contact.save(function(err, r) {
      if (err) {
        Responder.error(res, err);
      } else {
        Responder.success(res, r);
      }
    });
  },
  list: function(req, res, next) {
    Contact.find({}).
    populate('owner').
    exec(function(err, users) {
      if (err) {
        Responder.error(res, err);
      } else {
        Responder.success(res, users);
      }
    });
  }
}