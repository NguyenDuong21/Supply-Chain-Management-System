var mssql = require('mssql/msnodesqlv8');
require('dotenv').config()
var config = {
    server: process.env.DBSERVER,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DATABASE,
    driver: process.env.DBDRIVER
};

const conn = new mssql.ConnectionPool(config).connect().then(pool =>{
    return pool;
});

module.exports = {conn, mssql};