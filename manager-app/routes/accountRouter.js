const express = require('express');
const bodyParser = require('body-parser');
const accountRouter = express.Router();
accountRouter.use(bodyParser.json());


accountRouter.route('/')
.get((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({"response": "you are dead"});
});
module.exports = accountRouter;