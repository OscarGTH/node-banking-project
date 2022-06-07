const axios = require('axios');
const fs = require('fs');

let rawAccountData = fs.readFileSync('bank_accounts.json');
// Reading account numbers into memory
let accountData = JSON.parse(rawAccountData);

// Make client start sending transactions
startClient();

async function startClient(){
    // Looping indefinitely
    while(true) {
        // Getting random wait time in a range.
        let waitTime = getRandomInRange(0.2, 3) * 1000;
        // Waiting between each request
        await new Promise(resolve => setTimeout(resolve, waitTime));
        // Generating random index in a range of 0 to account number array length
        let accountIndex = getRandomInRange(0, accountData["account_numbers"].length);
        let accountNumber = accountData["account_numbers"][accountIndex]
        let transactionAmount = getTransactionAmount(500);
        // Calling function to perform the transaction
        performTransaction(accountNumber, transactionAmount)
    } 
}

// Returns random integer between min and max
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


// Returns randomly generated transaction amount
function getTransactionAmount(pos_max) {
    // Creating negative maximum amount
    let neg_max = pos_max * -1
    // Generating random amount between negative maximum and positive maximum
    return (Math.random() * (pos_max - neg_max) + neg_max).toFixed(2);
}
  
function performTransaction(accountNumber, transactionAmount) {
  axios
    .post('http://127.0.0.1:3000/transactions/' + accountNumber, {
      "amount": transactionAmount
    })
    .then(res => {
      console.log(`statusCode: ${res.status}`);
      console.log("Balance for account " + accountNumber +
                  " after transaction: "  + res.data["balance"]);
    })
    .catch(error => {
      console.error(error);
    });
}
