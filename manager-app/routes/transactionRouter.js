const express = require('express');
const bodyParser = require('body-parser');
const transactionRouter = express.Router();
transactionRouter.use(bodyParser.json());

// Storing account numbers and balances in memory
var accounts = {}

transactionRouter.route('/')
.get((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(accounts);
});

transactionRouter.route('/:accountNumber')
.get((req, res, next) => {
    if (accounts.hasOwnProperty(req.params.accountNumber)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(accounts[req.params.accountNumber]);
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({"error": "Invalid account number."});
    }
})
.post((req, res, next) => {
    if (req.body.amount != null) {
        // Check if account has previous entries
        if (accounts[req.params.accountNumber] == null){
            // Create an entry for the given bank account and set initial balance as zero.
            accounts[req.params.accountNumber] = {"balance": 0.0, "transactions": []}
        }

        var transAmount = parseFloat(req.body.amount);
        var timestamp = new Date().getTime();
        // Calculate balance after transaction
        let newBalance = (accounts[req.params.accountNumber]["balance"] +
                         transAmount).toFixed(2);
        // Updating the balance.
        accounts[req.params.accountNumber]["balance"] = parseFloat(newBalance)
        // Updating transaction info and timestamp.
        accounts[req.params.accountNumber]["transactions"].push({"amount": transAmount, "timestamp": timestamp })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        // Returning account data as response
        let response = accounts[req.params.accountNumber];
        res.json(response)
    } else {
        res.statusCode = 400;
        res.end("Transaction amount missing.")
    }
})

module.exports = transactionRouter;