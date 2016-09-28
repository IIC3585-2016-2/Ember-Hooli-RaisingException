var express = require('express');
var mongoose = require('mongoose');
var request = require('request')

var app = express();
var API_KEY = "9174426e1f8148708f5a0c653986e733"

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost/emberData');

var articleSchema = new mongoose.Schema({
    source: 'string',
    author: "string",
    title: "string",
    description: "string",
    url: "string",
    urlToImage: "string",
    publishedAt: "string"
})

var noteSchema = new mongoose.Schema({
	title: 'string',
	content: 'string',
	author: 'string'
});
var ArticleModel = mongoose.model('article',articleSchema)
var NoteModel = mongoose.model('note',noteSchema);
//New lines!
app.get('/api/',function(req,res) {
	res.send('Working');
});


app.get('/api/sources',function(req,res){
  // Aqui deberia meter las cosas a moongose
  request.get("https://newsapi.org/v1/articles?source=techcrunch&apiKey=9174426e1f8148708f5a0c653986e733",
  function(error,response,body){
    if (!error && response.statusCode == 200){
      var resp = JSON.parse(body)
      var source = resp['source']
      var articles = resp['articles']
      for (elem in articles){
        var article = articles[elem]
        article.source = source;
        console.log(article.author);
        var _tmp = new ArticleModel(article)
        _tmp.save(function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log(article.author);
            }
          })
      }
      res.send(200)
    }
    else{
      res.send(300)
    }
  }
)
});

app.get('/api/articles',function(req,res){
    ArticleModel.find({},function(err,docs) {
		if(err) {
			res.send(err);
		}
		else {
			res.send(docs);
		}
	});
});


app.get('/api/notes', function(req,res) {
	NoteModel.find({},function(err,docs) {
		if(err) {
			res.send(err);
		}
		else {
			res.send(docs);
		}
	});
});

app.listen('4500');
