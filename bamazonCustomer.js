var mysql = require("mysql");
var columnify = require("columnify");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "github",

  // Your password
  password: "github",
  database: "bamazon"
});

connection.connect(function(err) {

  if (err) throw err;

  // console.log("connected as id " + connection.threadId);

  displayProducts();

  // connection.end();
});



var purchaseCount = 0;
var stockCount = 0;
var product = "";
var itemIds = [];
var price = 0;
var sales = 0;

function displayProducts() {

  var sequel = "SELECT product_name, department_name, price, stock_quantity FROM products";
  connection.query(sequel, function(err, res) {

    if (err) throw err;

    // console.log(res);

    var columns = columnify(res, {
      columnSplitter: ' | ',
      paddingChr: '.',
    });

    // Display table of products
    console.log("Here is what is in stock:\n");
    
    console.log(columns);


    for (var i = 0; i < res.length; i++) {
      itemIds.push(res[i].product_name);
    }

    askBuyer();
  });
}

function updateDB() {

  var update = "UPDATE products SET stock_quantity = ?, product_sales = ? WHERE product_name = ?";

  connection.query(update, [stockCount - purchaseCount, sales.toFixed(2), product], function(err,res){

    console.log("Products Database Updated");

    connection.end();
  })
}

function askBuyer() {
  // Ask user what they would like to buy
  inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to buy?",
      choices: itemIds,
      name: "purchase"
    },
    {
      type: "prompt",
      message: "How many would you like to buy (enter a number)?",
      name: "count",
      validate: function(value) {
        if (isNaN(value) === false && value > 0) {
          return true;
        }
        return false;
      }
    }
  ])
  .then(function(inquirerResponse){

    // console.log(inquirerResponse.purchase);
    purchaseCount = inquirerResponse.count;

    purchaseItem = inquirerResponse.purchase;

    connection.query("select * from products where product_name = ?", purchaseItem, function(err,res) {

      if (err) throw err;

      stockCount = res[0].stock_quantity;

      product = res[0].product_name;

      price = res[0].price;

      sales = (res[0].price * purchaseCount) + res[0].product_sales;

      if (stockCount >= purchaseCount) {

        console.log("You chose to purchase " + purchaseCount + " " + product + "(s)");

        console.log("Your purchase cost is $" + (purchaseCount * price).toFixed(2));

        updateDB();    
      }

      else {

        console.log("Not enough in stock!");

        displayProducts();
      }
    })
  })
}