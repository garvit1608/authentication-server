var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database);

var db = mongoose.connection;

db.on('connect', function() {
  console.log('Connected to database');
});

db.on('error', function() {
  console.log('Connection error');
});


module.exports = db;