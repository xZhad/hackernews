var mongo = require('mongodb');
var monk = require('monk');

module.exports = function(app) {

    var db = monk('localhost:27017/reigndesigntest');

    app.use(function(req, res, next){
        req.db = db;
        next();
    });

    return db;

}
