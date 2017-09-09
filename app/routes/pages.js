var express = require('express');
var pages = express.Router();

pages.get('/', function(req, res, next) {
  res.render('hackernews', {
	'title' : 'Hacker News'
  });
});

module.exports = pages;
