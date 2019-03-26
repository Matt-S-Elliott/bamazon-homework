DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(25) NOT NULL,
    price DECIMAL(65,2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Waffles", "Grocery", 3.99, 150), ("Eggs", "Grocery", 2.99, 500), ("Bacon", "Grocery", 4.99, 250),
("Hot Wheels, Blue", "Toys", .99, 789), ("Squirt Gun", "Toys", 8.99, 67), ("Model Train", "Toys", 19.99, 90),
("Silly Putty", "Toys", 3.99, 3400), ("Motor Oil", "Auto", 17.99, 150), ("Windshield Wipers", "Auto", 23.99, 87),
("Hub Cap", "Auto", 29.99, 78), ("Mirror Dice", "Auto", 3.99, 203), ("Spark Plugs", "Auto", 3.99, 150);