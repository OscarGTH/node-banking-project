var express = require('express');
var { createProxyMiddleware } = require('http-proxy-middleware');
var indexRouter = require('./routes/index');
var port = process.env.PORT || 8080
var hostname = process.env.HOST || '0.0.0.0'
const PROXY_HOST = process.env.PROXY_HOST || '0.0.0.0'
const PROXY_PORT = process.env.PROXY_PORT || 8081;

var app = express();

app.use(express.static('public'))
app.use('/', indexRouter);
app.use('/transactions', createProxyMiddleware({target: 'http://' + PROXY_HOST + ':' + PROXY_PORT, changeOrigin: true}));

app.listen(port, hostname);
console.log(`Server runnning on http://${hostname}:${port}`);
