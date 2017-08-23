var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('../models/user');
var config = require('../config/config');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_APP_ID,
    clientSecret: config.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:3000/omniauth/google_oauth2/callback'
  },
    function(token, refreshToken, profile, cb) {
      console.log('validated');

      User.findOne({ googleId: profile.id }, function(err, user) {
        if (err) {
          return cb(err);
        }

        if (!user) {
          var user = new User({
            googleId: profile.id,
            name: profile.displayName,
            provider: 'google'
          });
          user.save(function(err) {
            if (err) {
              console.log(err);
            }

            return cb(null, user);
          });
        } else {
          console.log(user);
          return cb(null, user);
        }
      });
    }
  ));
}