const { formatDate } = require("../utils")


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
exports.get_stockRecording = (type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, is_limit = true) => {
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
exports.get_transportStatusOptions = () => {
    return global.sql_query(`SELECT * FROM order_status`)
}

//1.直接变动：直接对库存增删查改
//2.间接变动：撤销删除出入库记录
//3.复杂变动：修改更改出入库记录
exports.modify_stock = async (type, stock_id, amount) => {
    //type:cover,add,reduce
    //stock_id:变动id
    //amount:变动数量
    //验证stock_id合法性,以及获取修改前的数量
    let sql_query = `SELECT id,stock FROM stocks
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    if (!sql_result.length) return Promise.resolve([])
    let cur_stock = sql_result[0].stock
    let modify_sql_query;
    switch (type) {
        case "add":
            modify_sql_query = `UPDATE stocks
            SET stock = ${cur_stock + amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "reduce":
            modify_sql_query = `UPDATE stocks
            SET stock = ${cur_stock - amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "cover":
            modify_sql_query = `UPDATE stocks 
            SET stock = ${amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        default:
            return Promise.resolve([])
    }


    return global.sql_query(modify_sql_query)
}

//出入库记录
exports.modify_stock_recording = async (type, payload) => {
    //type:出/入库记录 in_stock,out_stock
    //payload:相关字段
    let sql_query
    if (type == "in_stock") sql_query = `INSERT INTO in_order(stock_id,price,amount,updata_date)
    VALUES(${payload.stock_id},${payload.price},${payload.amount},${payload.updata_date})`
    if (type == "out_stock") sql_query = `INSERT INTO out_order(stock_id,price,amount,another_fee,client_name,transport_status,transport_order,updata_date)
    VALUES(${payload.stock_id},${payload.price},${payload.amount},${payload.another_fee},"${payload.client_name}",${payload.transport_status},"${payload.transport_order}",${payload.updata_date})`
    return global.sql_query(sql_query)
}



