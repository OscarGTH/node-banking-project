// Flag to allow async functions to update accounts indefinitely
var updateAccounts = true;

// Sets account number to local storage for later use.
function setAccountToStorage(event) {
    localStorage.setItem('accountNumber', event.target.innerHTML);
    fetchAllData = false;
}

// Asynchronous function to continously update account data on all accounts.
async function updateAccountsData() {
    while (updateAccounts) {
      await new Promise(resolve => setTimeout(resolve, 3000));
        fetchAccountsData();
    }
}

// Handles loading individual account
function loadAccount(accountNumber) {
    // Set account number visible to user.
    document.getElementById('account-number').innerHTML = accountNumber;
    // Performing fetch right away after page load
    fetchAccountData(accountNumber)
    // Calling async function to run updater continuously
    updateAccountData(accountNumber)
}

// Calls functions to fetch account data for all accounts and starts updater
function loadAllAccounts() {
    fetchAccountsData()
    updateAccountsData()
}

// Asynchronous function to continously update account data on a specific account.
async function updateAccountData(accountNumber) {
    while (updateAccounts) {
      await new Promise(resolve => setTimeout(resolve, 3000));
        fetchAccountData(accountNumber);
    }
}

function fetchAccountData(accountNumber) {

    // Getting transaction data from server
    axios.get('http://localhost:3000/transactions/' + accountNumber)
    .then(function (response) {
        // Setting account balance and transaction count visible to user.
        document.getElementById("account-balance").innerHTML = response.data.balance + " €";
        document.getElementById("transaction-count").innerHTML = response.data.transactions.length;
        updateTransactionsTable(response.data.transactions)
    })
    .catch(function (error) {
        console.log(error);
        if (error.code == "ERR_NETWORK") {
            updateAccounts = false;
            console.log("Stopped account updater.")
        }
    });
}


function fetchAccountsData() {

    // Getting transaction data from server
    axios.get('http://localhost:3000/transactions')
    .then(function (response) {
        // handle success
        updateAccountsTable(response.data)
    })
    .catch(function (error) {
        // handle error
        console.log(error);
        // In case of network error (server down probably),
        // stopping account updater so it won't send calls for nothing
        if (error.code == "ERR_NETWORK") {
            updateAccounts = false;
            console.log("Stopped account updater.")
        }
    });
}

// Updates table with banking account data
function updateAccountsTable(accData) {
    // Looping over bank account data given in response
    for (var acc in accData) {
        // Finding corresponding row from table
        var accRow = document.getElementById(acc);
        // Getting account specific data from response data
        var data = accData[acc]
        // If account is already in table, just update its values.
        if (accRow) {
            var rowChildren = accRow.childNodes;
            // Checking if transaction count has changed
            // and updating values if it has.
            if (rowChildren[2].innerHTML < data.transactions.length) {
                rowChildren[1].innerHTML = data.balance + " €";
                rowChildren[2].innerHTML = data.transactions.length;
            }
        } else {
            // Bank account wasn't in table, so creating rows and table datas for the first time.
            var row = document.createElement('tr');

            var numCol = document.createElement('td');
            var numColLink = document.createElement('a');
            // Setting attributes for account link.
            numColLink.setAttribute('href', 'account.html');
            numColLink.setAttribute('class', 'account-link');
            // Setting onClick handler when link is clicked.
            numColLink.addEventListener("click", setAccountToStorage);
            numColLink.innerHTML = acc;
            numCol.append(numColLink);

            var balCol = document.createElement('td');
            balCol.innerHTML = data.balance + " €";

            var transCol = document.createElement('td');
            transCol.innerHTML = data.transactions.length;

            // Appending table data into table row
            row.append(numCol, balCol, transCol);
            // Marking table row with account number
            row.setAttribute('id', acc);

            // Appending table row into table.
            document.getElementById("accounts").append(row);
        }
    }
}


// Updates account specific table with transaction data
function updateTransactionsTable(transactionData) {
    
    var transactionTable = document.getElementById("transactions");

    // Getting row count of the transaction table
    var rowCount = transactionTable.childElementCount;
    // Comparing row count of the table 
    // and the transaction count to see if there are new entries.
    // Transaction table has caption and heading rows as childs, so 2 needs to be decreased.
    var newTransCount = transactionData.length - (rowCount - 2)

    if (newTransCount) {
        // Slicing the transaction array from the end, so only the new transactions remain.
        var newTransactions = transactionData.slice((newTransCount * -1), transactionData.length)

        // Looping over new transactions.
        for (var elem in newTransactions) {
            var transaction = newTransactions[elem];
            var transRow = document.createElement('tr');

            var amountCol = document.createElement('td');
            // Setting class depending on transaction type.
            amountCol.setAttribute("class", transaction.amount > 0 ? "deposit":"withdraw")
            amountCol.innerHTML = transaction.amount + " €";

            var typeCol = document.createElement('td');
            typeCol.innerHTML = (transaction.amount > 0 ? "Deposit" : "Withdraw");

            var tsCol = document.createElement('td');
            tsCol.innerHTML = new Date(transaction.timestamp).toLocaleString();

            transRow.append(amountCol, typeCol, tsCol);
            transactionTable.append(transRow);
        }    
    }
}
