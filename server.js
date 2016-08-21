var apiKey = process.env.HARVARD_ART_MUSEUMS;

var express     = require('express');
var cors        = require('cors');
var bodyParser  = require('body-parser');
var mongodb     = require('mongodb');
var rest        = require('restler');
var request     = require('request');
var md5         = require('md5');
var ObjectID = mongodb.ObjectID;
var app         = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var FAVORITES_COLLECTION = 'favorites';

var url= 'mongodb://heroku_0g40271l:7uj0frptq2f2avi25qtdjdocli@ds013366.mlab.com:13366/heroku_0g40271l'

// var url = 'mongodb://localhost:27017/techisart';
mongodb.MongoClient.connect(process.env.MONGODB_URI || url, function (err, database) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  db = database;

console.log("Database connection ready");

var server = app.listen(process.env.PORT || 80, function () {
// var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;// db = database;
    console.log("App now running on port", port);
  });
});

  function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  };

//////////////////////////////////////////////////////

//insert one new fave
app.post("/favorites/", function(req, res){
console.log("adding to favorites");
var myArtId = req.body.id;
var mytitle = req.body.title;
var mymedium = req.body.medium;
var myimagesource = req.body.imagesource;
var mycreditline = req.body.creditline;

try {
  db.collection(FAVORITES_COLLECTION).insertOne( { id: myArtId, title: mytitle, medium: mymedium, primaryimageurl: myimagesource, creditline: mycreditline }) ;
} catch (e) {
  print (e);
  };
});

//is Favorited ///////////////////////////////////////////////
//if the id exists in the database return true BE
app.get("/isFavorited/", function(req, res){
var myArtId = req.query.id;

db.collection(FAVORITES_COLLECTION).find({ id: myArtId }).toArray(function(err, docs) {
  if (err) {
    handleError(res, err.message, "Failed to get favorites.");
    } else {
      res.status(200).json(docs);
    }
  });

});

//find all fave //////////////////////////////////////
app.get("/findfavelist/", function(req, res){

db.collection(FAVORITES_COLLECTION).find({}).toArray(function(err, docs) {
  if (err) {
      handleError(res, err.message, "Failed to get favorites.");
    } else {
      res.status(200).json(docs);
    }
});
});
/////////////////////////////////////////////////////

app.post("/removeFavorites/", function(req, res){
  var myArtId = req.body.id;
    try {
      db.collection(FAVORITES_COLLECTION).remove( { id:   myArtId }) ;
        } catch (e) {
          print (e);
          };
});
//https://docs.mongodb.com/manual/reference/method/db.collection.remove/

//delete /////////////////////////////////////////////

app.get('/', function(request, response){
  response.json({"description":"Welcome to my project page"});
});

app.get('/arts/', function(req, response) {
  response.json({ "description" : "Arts endpoint"});
  //console.log("Arts");
}); // end welcome

app.post('/arts/search/', function(req, res) {
//console.log('hello')
  var endpointUrl = 'http://api.harvardartmuseums.org/object';
  var apiKeyQueryString = "?apikey=";
  var apiKey = process.env.HARVARD_ART_MUSEUMS;
  var fullQuery = endpointUrl + apiKeyQueryString + apiKey;
  var data = req.body;
  //console.log('im frontend data', data);

  request({
    url: fullQuery,
    method: 'GET',
    qs: data,
    callback: function(error, response, body) {
      res.send(body)
    }
  })
})
