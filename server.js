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
app.use(express.static(__dirname + '/public'));


app.use(['/','/index'], require('./routes/index')); //여러개의 라우팅을 한번에 : 배열에 담아서 선언.


app.listen(PORT, function(){
    console.log(`Listening on ${PORT}`);
});