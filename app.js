var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var http = require('http');

var ObjectId = mongo.ObjectID;
var db = monk('localhost:27017/reigndesigntest');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', index);

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

function checkAPI() {
  console.log(">>>> CHECKING API STARTING");
  var url = 'http://hn.algolia.com/api/v1/search_by_date?query=nodejs';
  http.get(url, function(response) {
    var finalData = "";
    response.on("data", function (data) {
      finalData += data.toString();
    });
    response.on("end", function() {
      var jsonData = JSON.parse(finalData).hits;
      for (var item in jsonData) {
        saveArticle(jsonData[item]);
      }
      console.log(">>>> CHECKING API ENDING");
    });
  });
}

function saveArticle(article) {
  var newId = "";
  var filllength = 12 - parseInt(article.objectID.length);
  for (var f = 0; f < filllength; f++) {
    newId += "0";
  }
  newId += article.objectID;
  article._id = ObjectId(newId);
  article.is_active = true;
  var collection = db.get('hackernews');
    collection.insert(article, function (err, doc) {
  });
}

var minutes = 60;
var the_interval = minutes * 60 * 1000;
setInterval(function() {
  checkAPI();
}, the_interval);

checkAPI();

module.exports = app;
