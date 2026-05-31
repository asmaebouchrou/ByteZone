const mysql = require('mysql2');
require('dotenv').config({path: 'stack-bytezone/.env'});

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_HOST_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

module.exports = db;
