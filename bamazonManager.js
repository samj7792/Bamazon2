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

  promptMngr();
});

var itemIds = [];
var product = '';
var stockCount = 0;
var addCount = 0;
var dptmntNames= [];

function promptMngr() {
  inquirer.prompt ([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
        name: 'choice'
      }
    ])
    .then(function(inqRes) {
      switch(inqRes.choice) {
        case 'View Products for Sale':
            viewProds();
            break;
        case 'View Low Inventory':
            lowInv();
            break;
        case 'Add to Inventory':
            addInv();
            break;
        case 'Add New Product':
            newProd();
            break;
        case 'Exit':
            exit();
            break;
      }
    })
}

function newProd() {

    var select = 'SELECT department_name FROM departments'

    connection.query(select, function(err, res) {

        for (var i = 0; i < res.length; i++) {

            dptmntNames.push(res[i].department_name)
        }

        inquirer.prompt([
            {
                type: 'prompt',
                message: 'What is the name of the product you would like to add?',
                name: 'product'
            },
            {
                type: 'list',
                message: 'To which department does the product belong?',
                choices: dptmntNames,
                name: 'department'
            },
            {
                type: 'prompt',
                message: 'How much will the product cost?',
                name: 'price',
                validate: function(value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: 'prompt',
                message: 'How much stock of the product would you like to add?',
                name: 'stock',
                validate: function(value) {
                    if (isNaN(value) === false && value > 0) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function(inqRes) {

            var stockArr = [inqRes.product, inqRes.department, inqRes.price, inqRes.stock];

            var insert = 'INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES (?, ?, ?, ?, 0.00)';

            connection.query(insert, stockArr, function(err, res) {

                if (err) throw err;

                console.log(stockArr[0] + ' has been added to the inventory.');

                promptMngr();
            });
        });
    });
}

function addInv() {
    var select = 'SELECT * FROM products';
    connection.query(select, function (err,res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            itemIds.push(res[i].item_id);
        }

        var columns = columnify(res, {
            columnSplitter: ' | ', 
            paddingChr: '.',
        });

        console.log('Here is the current stock\n');

        console.log(columns);

        addInvPrompt();
    })
}

function addInvPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What product (by item_id) would you like to add?',
            choices: itemIds,
            name: 'product',
        },
        {
            type: 'prompt',
            message: 'How many would you like to add (enter a number)?',
            name: 'count',
            validate: function(value) {
                if (isNaN(value) === false && value > 0) {
                  return true;
                }
                return false;
            }
        }
    ]).then(function(inqRes) {

        var select = 'SELECT * FROM products WHERE item_id = ?';
        
        product = inqRes.product;

        //console.log(product);

        addCount = parseInt(inqRes.count);

        connection.query(select, product, function(err,res) {
            if(err) throw err;

            //console.log(res);

            stockCount = res[0].stock_quantity;

            updateDB();
        })
    })
}

function updateDB() {

    var update = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';

    var updateArr = [stockCount + addCount, product];

    connection.query(update, updateArr, function(err,res) {

        console.log('Products added');

        promptMngr();
    })
}

function lowInv() {
    
    var selectLow = "SELECT * FROM products WHERE stock_quantity < 5"

    connection.query(selectLow, function(err,res) {

        if (err) throw err;

        console.log(res.length);

        var columns = columnify(res, {
            columnSplitter: ' | ',
            paddingChr: '.'
        });

        if (res.length === 0) {
            console.log('No low inventory')

            promptMngr();
        }

        else {
            console.log('Here is the low inventory\n');

            console.log(columns);

            promptMngr();
        }
    })
}

function viewProds() {

    var select = 'SELECT * FROM products';
    connection.query(select, function (err,res) {
        if (err) throw err;

        var columns = columnify(res, {
            columnSplitter: ' | ', 
            paddingChr: '.',
        });

        console.log('Here is what is in stock\n');

        console.log(columns);

        promptMngr();
    })
}

function exit() {
    connection.end();
}