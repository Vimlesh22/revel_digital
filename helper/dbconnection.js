let mysql = require('mysql');
var path = require('path');
let config = require(path.join(global.appRoot + "/helper/config.js")).get(process.env.NODE_ENV);

var pool = mysql.createPool({
    connectionLimit: 200,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    connectTimeout: 4000,
    acquireTimeout: 1 * 60 * 1000,
    timeout: 3 * 60 * 1000
});


exports.executequery = function(query) {
    // console.log('SQL QUERY -->\N', query);
    return new Promise((result, reject) => {
        pool.query(query, function(err, rows, fields) {
            if (err) {
                console.log(err);
                result(err);
            };
            // console.log("Query:",query);
            // console.log("Rows:",rows);
            result(rows);
        });
    });
}
exports.executevaluesquery = function(query, values) {
    // console.log('SQL QUERY -->\N', query, values);
    return new Promise((result, reject) => {
        pool.query(query, values, function(err, rows, fields) {
            if (err) {
                // console.log("sql query err ", err);
                reject(err);
            };
            // console.log("Query:", query);
            // console.log("Rows:", rows);
            result(rows);
        });
    });
}

exports.destroy = function(err, values) {
    return pool.rollback(function() {
        throw err;
    });
}