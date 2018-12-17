var express = require('express');
var app = express();
var fs = require("fs");
var aki = require("./aki-api-develop/index")
var bodyParser = require('body-parser');

var akinator = require('./aki-api-develop/build/t');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})
app.get('/', function(req, res){
    res.send('Hello World');
});

var router = require('./router')(app, fs, akinator);