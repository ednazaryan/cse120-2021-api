const express = require('express');
const bodyParser  = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId; 

const uri =
  "mongodb+srv://nazaryan-admin:2gtyaQ4Bs4zHV8i@cluster0.mm3fw.mongodb.net/cse-120-2021-db?retryWrites=true&w=majority";

const client = new MongoClient(uri);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cors())

app.use(function (req, res, next) {
    res.header('Cache-Control',
               'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
                  'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Max-Age', '30000');
    res.setHeader('Access-Control-Allow-Headers',
                  'Content-Type, Authorization, X-Requested-With');
    next();
});  

app.get('/', function (req, res) {
  res.render('index', {});
})

app.post('/', function (req, res) {
  res.send({"message":"Sent"});
})

app.get('/data', function (req, res) {
  client.connect()
  .then(client => {
    client.db('cse120-2021-db').collection('books').find().toArray()
      .then(results => {
        console.log(results)
        res.send({"data":results});
      })
      .catch(error => console.error(error))
  })
  .catch(console.error)
})

app.post('/data', function (req, res) {
  client.connect()
  .then(client => {
    client.db('cse120-2021-db').collection('books').insertOne(req.body)
      .then(result => {
        console.log(result)
        res.send({"message":"Added"});
      })
      .catch(error => console.error(error))
  })
  .catch(console.error)
})

app.post('/data/delete', function (req, res) {
  client.connect()
  .then(client => {
    let id = req.body.id;
    const query = { "_id": ObjectId(id)};
    client.db('cse120-2021-db').collection('books').deleteOne(query)
      .then(result => {
        console.log(result.deletedCount)
        res.send({"deleted":result.deletedCount});
      })
      .catch(error => console.error(error))
  })
  .catch(console.error)
})

app.listen(port, function () {
    console.log('Example app listening on port 3001!')
})

app.get('*', function(req, res) {
        res.status(404).send('Bad/Default Route.');
});
