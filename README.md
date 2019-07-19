# Bamazon

Bamazon is a command line node application that interacts with a SQL database in order to represent customer interactions as well as the duties of both a manager and supervisor.

To run bamazonCustomer:

    In bash/terminal type:

        * node bamazonCustomer.js
    
    Then choose the product you would like to buy and then enter the number of items you would like to buy.

To run bamazonManager:

    In bash/terminal type:

        * node bamazonManager.js

    You will then be prompted to choose between:

        * View Products for Sale (shows a table of the products for sale)

        * View Low Inventory (shows all products with less than 5 items in stock)

        * Add to Inventory (allows manager to add stock to the current products in inventory)

        * Add New Product (allows manager to add a new product to an existing department)

To run bamazonSupervisor:

    In bash/terminal type:

        * node bamazonSupervisor.js
    
    You will then be prompted to choose between:

        * View product sales by department (this will display a table showing each department's profit)

        * Create new department (this will allow the supervisor to create a new department)

Video showing program in action:

    [Link to GoogleDrive](https://drive.google.com/file/d/1ytWtpTBPm-vjicntIrjI1vZhPSr-C7Xp/view)

Technologies used:

    JavaScript, node, inquirer, mySQL, columnify

Created by Samuel Jackson