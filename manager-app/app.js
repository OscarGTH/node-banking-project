var express = require('express');
var logger = require('morgan');
var cors = require('cors');
http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var transactionRouter = require('./routes/transactionRouter');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/transactions', transactionRouter);


// Catch 404 and forward it
app.use(function(req, res, next) {
    next(createError(404));
});
  

// Error handler
app.use(function(err, req, res, next) {
    // Only provide error in dev
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Account manager running at http://${hostname}:${port}/`);
});

module.exports = app;