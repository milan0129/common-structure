const mysql = require('mysql2');
var configuration = {};

configuration = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce_management_system',
    dateStrings: 'date'
}
const con = mysql.createPool(configuration);
module.exports = con;