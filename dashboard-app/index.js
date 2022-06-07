var express = require('express');
var http = require('http')
var indexRouter = require('./routes/index');
var port = 4000
var hostname = "localhost"

var app = express();

app.use(express.static('public'))
app.use('/', indexRouter);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Account manager running at http://${hostname}:${port}/`);
});