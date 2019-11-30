// Lee Seung Hyun

var express = require("express");
var app = express();
var bodyparser = require('body-parser');
var underscore = require('underscore');

app.locals.pretty = true;

var PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(express.static('/public'));


app.get('/', function(req, res){
    res.send("Hello wolrd!");
})

app.listen(PORT, function(){
    console.log(`Listening on ${PORT}`);
});