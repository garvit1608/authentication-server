var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var bcrypt          = require('bcrypt');
var SALT_WORK_FACTOR    = 10;

var userSchema = new Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  admin: Boolean,
  googleId: String,
  provider: String
});

userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if ( ! user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.post('save', function(err, user, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    next(new Error('Username must be unique'));
  }
});

userSchema.methods.validPassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);