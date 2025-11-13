
const mysql = require ('mysql2');
//const bcrypt = require('bcrypt');

require('dotenv').config({path: 'stack-tshirts/.env'});

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_HOST_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
    });
db.connect(err =>{
    if(err){
        console.error('Error connecting to the database: ',err);
        return;
    }
    console.log('Connection to the database successfully completed')
});
module.exports=db;
