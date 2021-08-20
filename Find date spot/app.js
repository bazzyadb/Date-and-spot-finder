var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dateSpotRouter = require('./routes/date-spot-finder');
const mockData = require('./services/mock_data_gen');

const db = require('./config/keys').mongoURI;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/findDateSpot', dateSpotRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// connect to mongoDb data base

mongoose.connect(db, { useUnifiedTopology: true }).then(function() {
    console.log('MongoDB Connected')
  })
  .catch(err => console.log(err));

// generating mock data.
//mockData.generateMockData();

// starting the application
app.listen(3001, function(err) {
    if(err) console.log(err);
    else    console.log(" SERVER ACTIVE ON PORT 3001");
});

module.exports = app;
