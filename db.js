const mysql = require('mysql');

// config dotenv module
require('dotenv').config();

// connection instance
const connection = mysql.createPool({
    connectionLimit:100,
    host:process.env.HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME
});


module.exports = connection;