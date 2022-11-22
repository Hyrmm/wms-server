exports.get_stock = (order_by, direction, page) => {
    let offset = (page - 1) * 20
    return global.sql_query(`SELECT * FROM stocks
    ORDER BY ${order_by} ${direction}
    LIMIT ${offset},20`)
}




exports.get_stockRecording = (type, order_by, direction, page, filter, filter_data) => {
    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query, filter_sql_query
    // 过滤条件查询
    if (filter) {
        switch (filter) {
            case "date":
                filter_sql_query = `AND updata_date BETWEEN '${filter_data[0]}' AND '${filter_data[1]}'`
                break;
            default:
                return Promise.resolve("[]");
        }
    } else {
        filter_sql_query = ""
    }
    if (type == "in_order") {
        sql_query = `SELECT in_order.id,stocks.name,stocks.type,price,amount,updata_date
        FROM in_order,stocks
        WHERE in_order.stock_id = stocks.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        LIMIT ${offset},20`
        console.log(sql_query)
    } else {
        sql_query = `SELECT out_order.id,stocks.name,stocks.type,price,amount,another_fee,client_name AS 'client',status_name AS 'status' ,transport_order,updata_date
        FROM out_order,stocks,order_status
        WHERE out_order.stock_id = stocks.id AND out_order.transport_status = order_status.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        LIMIT  ${offset},20`
    }

    return global.sql_query(sql_query)
}



exports.get_storeOptions = (max_amount = 500) => {

    let sql_query = `SELECT id,name,type FROM stocks
    LIMIT 0,${max_amount}`
    return global.sql_query(sql_query)
}