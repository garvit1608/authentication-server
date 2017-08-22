var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = require('./config/database');
var config = require('./config/config');
var authService = require('./services/auth');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/user');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(passport.initialize());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.post('/authenticate', authService.authenticate);



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
        return cb(null, user);
      }
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/omniauth/google_oauth2/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.send('google authentication successfull');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
