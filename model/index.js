const { dataBaseConfig } = require("../config")
const mysql = require('mysql');
const pool = mysql.createPool(dataBaseConfig);




//全局暴露方法
global.sql_query = (query) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            let sql_query = query
            connection.query(sql_query, (err, result) => {
                //释放连接
                pool.releaseConnection(connection)
                // connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        })
    })
}





exports.user = require("./user")
exports.store = require("./store")
exports.client = require("./client")
exports.dataVisual = require("./dataVisual")











