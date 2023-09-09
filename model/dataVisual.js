/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-12-06 19:03:08
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2022-12-30 19:22:09
 * @FilePath: \wms-server\model\dataVisual.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */




exports.get_total_stock = (type) => {
    let stockName
    switch (type) {
        case 1: {
            stockName = "materialStock"
            break
        }
        case 2: {
            stockName = "productStock"
            break
        }
    }
    let sql_query = `SELECT COUNT(*) AS total FROM ${stockName}`
    return global.sql_query(sql_query)
}
exports.get_total_client = () => {
    let sql_query = `SELECT COUNT(*) AS total FROM client`
    return global.sql_query(sql_query)
}

exports.get_total_inOrder = (type) => {

    let tableName
    switch (type) {
        case 1: {
            tableName = "materialRecordIn"
            break
        }
        case 2: {
            tableName = "productRecordIn"
            break
        }
    }

    let sql_query = `SELECT COUNT(*) AS total FROM ${tableName}`
    return global.sql_query(sql_query)
}
exports.get_total_outOrder = (type) => {
    let tableName
    switch (type) {
        case 1: {
            tableName = "materialRecordOut"
            break
        }
        case 2: {
            tableName = "productRecordOut"
            break
        }
    }

    let sql_query = `SELECT COUNT(*) AS total FROM ${tableName}`
    return global.sql_query(sql_query)
}
//获取不同状态订单
exports.get_order = (start_date, end_date) => {
    //status 1:未收货 2:已发货 3:已收货 4:退回仓库 5:退回原厂
    //date:
    let filter_query = ""
    if (start_date && end_date) filter_query += `AND updata_date BETWEEN "${start_date}" AND "${end_date}"`
    let sql_query = `SELECT *  FROM out_order
    WHERE transport_status IN (3,4,5) ${filter_query}`
    return global.sql_query(sql_query)
}


exports.get_order_count = (status) => {
    let sql_query = `SELECT COUNT(*) AS total FROM out_order
    WHERE transport_status = ${status}`
    return global.sql_query(sql_query)
}


exports.get_store = (type) => {
    let tableName
    switch (type) {
        case 1: {
            tableName = "materialStock"
            break
        }
        case 2: {
            tableName = "productStock"
            break
        }
    }
    let sql_query = `SELECT * FROM ${tableName}`
    return global.sql_query(sql_query)
}
exports.get_date_order = (year, month) => {

}
