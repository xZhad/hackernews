var http = require('http');
var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;
var schedule = require('node-schedule');

module.exports = function(db) {

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

    checkAPI();

    var cron = schedule.scheduleJob('5 * * * *', function(){
        checkAPI();
    });

}
