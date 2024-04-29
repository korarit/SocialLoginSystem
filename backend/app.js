require('dotenv').config();

var cors = require('cors');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');


var SQLiteStore = require('connect-sqlite3')(session);


var authRouter = require('./routes/auth');


var app = express();

app.locals.pluralize = require('pluralize');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  secure: false,
  httpOnly: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use('/', authRouter);


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
