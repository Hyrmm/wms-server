


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
exports.get_stockRecording = (type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, is_limit = true, is_finishDate = false) => {
    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query, filter_sql_query = ""

    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) {
        limit_sql_query = `LIMIT ${offset},20`
    }



    //名称、类型过滤处理
    if (filter_name) filter_sql_query += ` AND stocks.name="${filter_name}"`
    if (filter_type) filter_sql_query += ` AND stocks.type="${filter_type}"`
    //时间过滤处理
    let filterDate_key
    if (is_finishDate) {
        filterDate_key = "finish_date"
    } else {
        filterDate_key = "updata_date"
    }




    if (filter_date_start && filter_date_end) {
        filter_sql_query += ` AND ${filterDate_key} BETWEEN "${filter_date_start}" AND "${filter_date_end}"`
    } else {
        if (filter_date_start) filter_sql_query += ` AND ${filterDate_key} >= "${filter_date_start}"`
        if (filter_date_end) filter_sql_query += ` AND ${filterDate_key} <= "${filter_date_end}"`
    }



    //出库订单状态过滤处理
    if (type == "out_order" && filter_transportStatus) {
        filter_sql_query += `AND transport_status = ${filter_transportStatus}`
    }

    // //客户ID过滤(废弃)
    // if (type == "out_order" && filter_clientId) {
    //     filter_sql_query += `AND client_id = ${filter_clientId}`
    // }

    //客户名模糊过滤
    if (type == "out_order" && filter_clientName) {
        filter_sql_query += ` AND client.name LIKE "%${filter_clientName}%"`
    }



    //查询类型处理

    if (type == "in_order") {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS in_order.id,stocks.name,stocks.type,price,amount,updata_date,price*amount AS total_cost,nick
        FROM in_order,stocks,users
        WHERE in_order.stock_id = stocks.id AND in_order.user_id=users.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    } else {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS out_order.id,stocks.name,stocks.type,stock_id,price,amount,another_fee,client.name AS 'client',client.tel AS client_tel,client.address AS client_address,status_name AS 'status' ,order_status.id AS status_id,transport_order,updata_date,finish_date,nick
        FROM out_order,stocks,order_status,users,client
        WHERE client_id = client.id AND out_order.stock_id = stocks.id AND out_order.transport_status = order_status.id AND out_order.user_id=users.id ${filter_sql_query}
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


//变动库存(在原有基础上增删改)
//1.直接变动：直接对库存增删查改
//2.间接变动：撤销删除出入库记录 修改更改出入库记录
exports.modify_stock = async (type, stock_id, amount) => {
    //type:cover,add,reduce
    //stock_id:变动id
    //amount:变动数量
    //验证stock_id合法性,以及获取修改前的数量
    let sql_query = `SELECT id,stock FROM stocks
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    if (!sql_result.length) return Promise.resolve(false)
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
            return Promise.resolve(false)
    }


    return global.sql_query(modify_sql_query)
}

//新增出入库记录
exports.add_stock_recording = async (type, payload) => {
    //type:出/入库记录 in_stock,out_stock
    //payload:相关字段
    let sql_query
    if (type == "in_stock") sql_query = `INSERT INTO in_order(stock_id,price,amount,updata_date,user_id)
    VALUES(${payload.stock_id},${payload.price},${payload.amount},${payload.updata_date},${payload.user_id})`
    if (type == "out_stock") sql_query = `INSERT INTO out_order(stock_id,price,amount,another_fee,client_id,transport_status,transport_order,updata_date,user_id)
    VALUES(${payload.stock_id},${payload.price},${payload.amount},${payload.another_fee},${payload.client_id},${payload.transport_status},"${payload.transport_order}",${payload.updata_date},${payload.user_id})`
    return global.sql_query(sql_query)

}

//新增库存
exports.add_stock = async (name, type, stock) => {
    //验证是否存在冲突
    let exist_sql_query = `SELECT * FROM stocks
    WHERE name ="${name}" AND type = "${type}"`
    let exist_result = await global.sql_query(exist_sql_query)
    if (exist_result.length) return Promise.resolve(false)
    let sql_query = `INSERT INTO stocks(name,type,stock,last_updata)
    VALUES("${name}","${type}",${stock},CURRENT_TIMESTAMP())`
    return global.sql_query(sql_query)
}

exports.modify_out_store_status = async (id, modify_status) => {
    let sql_query = `UPDATE out_order 
    SET transport_status = ${modify_status} 
    WHERE id='${id}'`
    return global.sql_query(sql_query)

}

//验证transport_status合法
exports.ruled_transport_status = async (transport_status) => {
    let sql_query = `SELECT id from order_status
    WHERE id =  ${transport_status}`
    return global.sql_query(sql_query)
}


exports.$get_out_store_recording = async (order_id) => {
    let sql_query = `SELECT transport_status AS ori_status,stock_id,amount FROM out_order
    WHERE id = ${order_id}`
    return global.sql_query(sql_query)

}

//生成订单完成时间
exports.$set_out_store_finish_date = async (order_id, modify = "CURRENT_TIMESTAMP()") => {
    let sql_query = `UPDATE out_order
    SET finish_date = ${modify}
    WHERE id = ${order_id}`
    return global.sql_query(sql_query)
}