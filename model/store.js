exports.get_stock = (order_by, direction, page) => {
    let offset = (page - 1) * 20
    return global.sql_query(`SELECT * FROM stocks
    ORDER BY ${order_by} ${direction}
    LIMIT ${offset},20`)
}




exports.get_stockRecording = (type, order_by, direction, page) => {

    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query
    if (type == "in_order") {
        sql_query = `SELECT in_order.id,stocks.name,stocks.type,price,amount,in_order.updata_date 
        FROM in_order,stocks
        WHERE in_order.stock_id = stocks.id
        ORDER BY ${order_by} ${direction}
        LIMIT ${offset},20`

    } else {
        sql_query = `SELECT out_order.id,stocks.name,stocks.type,price,amount,another_fee,client_name AS 'client',status_name AS 'status' ,transport_order,out_order.updata_date
        FROM out_order,stocks,order_status
        WHERE out_order.stock_id = stocks.id AND out_order.transport_status = order_status.id
        ORDER BY ${order_by} ${direction}
        LIMIT  ${offset},20`
    }


    return global.sql_query(sql_query)
}