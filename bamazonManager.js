const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(err => {
    if (err) throw err;
});

main();

function main() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "choice",
            choices: ["View Products for Sale", "View Low Inventory Products", "Add Inventory to Existing Product", "Add New Product", "Exit"]
        }
    ]).then(response => {
        switch (response.choice) {
            case "View Products for Sale":
                connection.query("SELECT * FROM products", (err, results) => {
                    console.table(results);
                    main();
                })
                break;
            case "View Low Inventory Products":
                connection.query("SELECT * FROM products WHERE stock_quantity < 6", (err, results) => {
                    console.table(results);
                    main();
                })
                break;
            case "Add Inventory to Existing Product":
                connection.query("SELECT * FROM products", (err, results) => {
                    console.table(results);
                    console.log(results);
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "What is the item_id of the item you would like to add?",
                            name: "choice",
                            validate: choice => {
                                if (parseInt(choice) <= results.length + 1) {
                                    return true;
                                }
                                else return false;
                            }
                        },
                        {
                            type: "input",
                            message: "How many would you like to add?",
                            name: "quantity",
                            validate: quantity => {
                                if (isNaN(quantity)) { return false; }
                                else return true;
                            }
                        }
                    ]).then(response => {
                        let item_chosen = results.find(obj => { return obj.item_id === parseInt(response.choice); });
                        let newQuantity = parseInt(item_chosen.stock_quantity) + parseInt(response.quantity);
                        connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newQuantity},{item_id: response.choice}],(err, res) => {if (err) throw err;});
                        main();
                    })
                })
                break;
            case "Add New Product":
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the product?",
                        name: "productName"
                    },
                    {
                        type: "input",
                        message: "What is the department of the product?",
                        name: "productDepartment"
                    },
                    {
                        type: "input",
                        message: "What is the price of the product?",
                        name: "productPrice"
                    },
                    {
                        type: "input",
                        message: "What is the stock quantity?",
                        name: "productStock"
                    }
                ]).then(response => {
                    connection.query(
                        "INSERT INTO products SET ?",
                        {
                          product_name: response.productName,
                          department_name: response.productDepartment,
                          price: response.productPrice,
                          stock_quantity: response.productStock
                        },
                        (err, res) => {if (err) throw err;}
                        
                      );
                      main();
                })
                break;
            case "Exit":
                connection.end();
                process.exit();
                break;
        }
    })
}