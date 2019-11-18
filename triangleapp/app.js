var express = require("express");
var app     = express();
var path    = require("path");
app.use(express.urlencoded())

app.use(express.static(__dirname + '/public'));

app.get('processTriangle.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/processTriangle.js'));
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.listen(3000);
console.log("Running at Port 3000");

/*const path = require('path')
const express = require('express')
const layout = require('express-layout')
const routes = require('./routes')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const middleware = [
  layout(),
  express.static(path.join(__dirname, 'public')),
]
app.use(middleware)

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => {
  console.log(`App running at http://localhost:3000`)
})*/