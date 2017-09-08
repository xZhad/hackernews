var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {});
});

router.get('/article', function(req, res) {
    var db = req.db;
    var collection = db.get('hackernews');
    collection.find({"is_active": true}, {sort: {'created_at_i': -1}}, function(e, articles) {
        res.json(articles);
    });
});

router.delete('/article/:id', function(req, res) {
  var db = req.db;
  var collection = db.get('hackernews');
  var articleToDelete = req.params.id;
  collection.update({"_id": articleToDelete}, {"is_active": false}, function(err) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
