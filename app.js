
'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ejs = require('ejs');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);


const router = require('./router');

app.use(morgan('dev'));
app.use(express.static(__dirname+'/assets'));
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

app.use(session({
name:'my-session',
secret: process.env.SECRET,
resave: false,
saveUninitialized: true,
cookie: { secure: false, httpOnly: true ,maxAge: 60*1000*10, path: '/'},
store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(expressValidator());

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});


app.use('/', router);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {err}
    });
  });

module.exports = app;