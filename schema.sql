create database bamazon;

use bamazon;

drop table products;

alter table products
add product_sales decimal(10,2) not null;

create table products(
item_id integer not null auto_increment,
product_name varchar(30) not null,
department_name varchar(30) not null,
price decimal(10, 2) not null,
stock_quantity integer(10) not null,
primary key (item_id)
);

create table departments(
department_id integer(10) not null auto_increment,
department_name varchar(30) not null,
over_head_costs integer(10) not null,
primary key (department_id)
);

select * from departments;

select price, stock_quantity, stock_quantity - price from products;

insert into products
(product_name, department_name, price, stock_quantity)
values ('Popsicles', 'Frozen', 7.99, 10);

insert into departments
(department_name, over_head_costs)
values ('Fresh Produce', '3000'),('Pasta', '3500'),('Dairy', 2000),('Frozen', 1500),('Snackfoods', 1000),('Bakery', 250);

update departments
set over_head_costs = '100'
where department_name = 'Snackfoods';

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales
FROM departments INNER JOIN products 
ON departments.department_name = products.department_name
GROUP BY department_name;

SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS product_sales, product_sales - departments.over_head_costs AS total_profit 
FROM products, departments; 

SELECT SUM(product_sales)
FROM products
WHERE department_name = 'Fresh Produce';
