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

connection.query("SELECT * FROM products", (err, results) => {
    console.table(results);
    inquirer.prompt([
        {
            type: "input",
            message: "What is the item_id of the item you would like to buy?",
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
            message: "How many would you like?",
            name: "quantity",
            validate: quantity => {
                if (isNaN(quantity)) {return false;}
                else return true;
            }
        }
    ]).then(response => {
        let item_chosen = results.find(obj => {return obj.item_id === parseInt(response.choice);});
        console.log(item_chosen);
    })
});
