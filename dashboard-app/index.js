var express = require('express');
var indexRouter = require('./routes/index');
var port = 8080
var hostname = '0.0.0.0'

var app = express();

app.use(express.static('public'))
app.use('/', indexRouter);

app.listen(port, hostname);
console.log(`Server runnning on http://${hostname}:${port}`);
