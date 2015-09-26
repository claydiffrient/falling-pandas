import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import session from 'express-session';
import methodOverride from 'method-override';
import compress from 'compression';
import config from 'config';

let app = express();

// view engine setup
let viewDir = path.join(__dirname, 'views');
app.engine('handlebars', exphbs({
  defaultLayout: 'index',
  layoutsDir: viewDir + '/layouts',
  partialsDir: viewDir + '/partials'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

if (app.get('env') === 'development') {
  app.use(logger('dev'));
} else if (app.get('env') === 'production') {
  app.use(compress());
}

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'pandas fall all the time'
}));

app.use('/', require('./routes'));

app.use(express.static(path.join(__dirname, '../client')));



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

export default app;
