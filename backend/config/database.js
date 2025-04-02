var mysql = require('mysql');

var con = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'task_',
    dateStrings : 'date'
});
module.exports = con;