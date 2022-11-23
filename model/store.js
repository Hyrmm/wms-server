const e = require("express")

exports.get_stock = (order_by, direction, page, name, is_limit = true) => {
    let offset = (page - 1) * 20



    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) limit_sql_query = `LIMIT ${offset},20`

    let filter_sql_query = ""
    if (name) filter_sql_query = `WHERE name = "${name}"`




    return global.sql_query(`SELECT * FROM stocks
    ${filter_sql_query}
    ORDER BY ${order_by} ${direction}
    ${limit_sql_query}`)
}




exports.get_stockRecording = function (type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, is_limit = true) {
    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query, filter_sql_query = ""

    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) {
        limit_sql_query = `LIMIT ${offset},20`
    }



    //过滤条件筛选
    if (filter_name) filter_sql_query += ` AND stocks.name="${filter_name}"`
    if (filter_type) filter_sql_query += ` AND stocks.type="${filter_type}"`
    //时间过滤处理
    if (filter_date_start && filter_date_end) {
        filter_sql_query += ` AND updata_date BTWEEN "${filter_date_start}" AND "${filter_date_end}"`
    } else {
        if (filter_date_start) filter_sql_query += ` AND updata_date >= "${filter_date_start}"`
        if (filter_date_end) filter_sql_query += ` AND updata_date <= "${filter_date_end}"`
    }
    //查询类型处理
    if (type == "in_order") {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS in_order.id,stocks.name,stocks.type,price,amount,updata_date,price*amount AS total_cost
        FROM in_order,stocks
        WHERE in_order.stock_id = stocks.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    } else {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS out_order.id,stocks.name,stocks.type,price,amount,another_fee,client_name AS 'client',status_name AS 'status' ,transport_order,updata_date
        FROM out_order,stocks,order_status
        WHERE out_order.stock_id = stocks.id AND out_order.transport_status = order_status.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    }

    return global.sql_query(sql_query)
}

exports.get_storeOptions = (max_amount = 500) => {

    let sql_query = `SELECT id,name,type FROM stocks
    LIMIT 0,${max_amount}`
    return global.sql_query(sql_query)
}