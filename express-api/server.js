import express from 'express';
import mongoose from 'mongoose';
import request from 'request';

const app = express();
const API_KEY = "9174426e1f8148708f5a0c653986e733"

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

mongoose.connect('mongodb://localhost/emberData');

const articleSchema = new mongoose.Schema({
    source: 'string',
    author: "string",
    title: "string",
    description: "string",
    url: "string",
    urlToImage: "string",
    publishedAt: "string"
})

const noteSchema = new mongoose.Schema({
	title: 'string',
	content: 'string',
	author: 'string'
});

const ArticleModel = mongoose.model('article',articleSchema);
const NoteModel = mongoose.model('note',noteSchema);
//New lines!
app.get('/api/', (req,res) => {
	res.send('Working');
});


app.get('/api/sources', (req,res) => {
  // Aqui deberia meter las cosas a moongose
  request.get("https://newsapi.org/v1/articles?source=techcrunch&apiKey=9174426e1f8148708f5a0c653986e733",
    (error,response,body) => {
      if (!error && response.statusCode == 200){
        const resp = JSON.parse(body)
        const source = resp['source']
        const articles = resp['articles']
        for (elem in articles) {
          const article = articles[elem]
          article.source = source;
          console.log(article.author);
          const _tmp = new ArticleModel(article)
          _tmp.save(err => {
            if (err) {
              console.log(err);
            } else {
              console.log(article.author);
            }
          })
        }
        res.send(200)
      } else {
        res.send(300)
      }
    }
  )
});

app.get('/api/articles', (req,res) => {
  ArticleModel.find({}, (err,docs) => {
    if(err) {
      res.send(err);
    } else {
      docs.sort((a,b) => {
        a = new Date(a.publishedAt);
        b = new Date(b.publishedAt);
        return a>b ? -1 : a<b ? 1 : 0;
      });
      res.send(docs);
    }
  });
});


app.get('/api/notes', (req,res) => {
  NoteModel.find({}, (err,docs) => {
    if(err) res.send(err);
    else res.send(docs);
  });
});

app.listen('4500');
