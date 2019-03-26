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
buySomething(true);

function printStuff(results) {
    console.table(results);
    console.log("At anytime, type 'table' to see the items available again.");
    console.log("Type 'exit' to quit.");
}


function buySomething(firstTime) {
    connection.query("SELECT * FROM products", (err, results) => {
        if (firstTime) {
            printStuff(results);
        }
        inquirer.prompt([
            {
                type: "input",
                message: "What is the item_id of the item you would like to buy?",
                name: "choice",
                validate: choice => {
                    if (choice === "exit") {
                        connection.end();
                        process.exit();
                    }
                    if (choice === "table") {
                        printStuff(results);
                        return false;
                    }
                    if (parseInt(choice) <= results.length + 1) {
                        return true;
                    }
                    else return false;
                }
            },
            {
                type: "input",
                message: "How many would you like?",
                name: "quantity",
                validate: quantity => {
                    if (quantity === "exit") {
                        connection.end();
                        process.exit();
                    }
                    if (quantity === "table") {
                        printStuff(results);
                        return false;
                    }
                    if (isNaN(quantity)) { return false; }
                    else return true;
                }
            }
        ]).then(response => {
            let item_chosen = results.find(obj => { return obj.item_id === parseInt(response.choice); });
            if (response.quantity > item_chosen.stock_quantity) {
                console.log("Not enought in stock! Sorry...");
                buySomething(false);
            } else {
                let new_quantity = parseInt(item_chosen.stock_quantity) - parseInt(response.quantity);
                var query = connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: new_quantity
                        },
                        {
                            item_id: response.choice
                        }
                    ],
                    (err, res) => {
                        console.log(`Sure! That'll be $${(parseInt(response.quantity) * item_chosen.price).toFixed(2)}, please!`);
                        buySomething(false);
                    }
                );
            }
        })
    });
}