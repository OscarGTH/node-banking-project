var express = require('express');
var axios = require('axios');
var router = express.Router();
const PORT = process.env.PORT || '8081';
const HOST = process.env.HOST || '0.0.0.0';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page' });
});

router.get('/transactions', function(req, res, next) {
  // Getting transaction data from server
  axios.get('http://' + HOST + ':' + PORT + '/transactions')
  .then(function (response) {
    console.log(response)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response.data);
  })
  .catch(function (error) {
      console.log(error.message);
  });
});

router.get('/transactions/:accountNumber', function(req, res, next) {
  // Getting transaction data from server
  axios.get('http://' + HOST + ':' + PORT + '/transactions/' + accountNumber)
  .then(function (response) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(function (error) {
      console.log(error.message);
  });
});

module.exports = router;
