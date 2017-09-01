var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  number: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


module.exports = mongoose.model('Contact', contactSchema);