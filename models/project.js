var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  creationDate: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Project', projectSchema);