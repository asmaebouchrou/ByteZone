const mysql = require ('mysql2');
require('dotenv').config({path: 'stack-tshirts/.env'});

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_HOST_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise(); 

module.exports = db;
