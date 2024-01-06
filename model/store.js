


exports.get_stock = (order_by, direction, page, name, is_limit = true, type, nullStock) => {
    let offset = (page - 1) * 20

    let tableName
    switch (type) {
        case "1": {
            tableName = "materialStock"
            break
        }

        case "2": {
            tableName = "productStock"
            break
        }
    }


    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) limit_sql_query = `LIMIT ${offset},20`

    let filter_sql_query = ""
    if (name) filter_sql_query = `WHERE name = "${name}"`

    if (filter_sql_query) {
        filter_sql_query += ` AND stock ${nullStock ? "> 0" : ">= 0"}`
    } else {
        filter_sql_query += `WHERE stock ${nullStock ? "> 0" : ">= 0"}`
    }



    return global.sql_query(`SELECT * FROM ${tableName}
    ${filter_sql_query}
    ORDER BY ${order_by} ${direction}
    ${limit_sql_query}`)
}

// 查询成品出入库记录
exports.get_stockProductRecording = (type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, is_limit = true, is_finishDate = false) => {
    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query, filter_sql_query = ""

    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) {
        limit_sql_query = `LIMIT ${offset},20`
    }



    //名称、类型过滤处理
    if (filter_name) filter_sql_query += ` AND productStock.name="${filter_name}"`
    if (filter_type) filter_sql_query += ` AND productStock.type="${filter_type}"`
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



    //客户名模糊过滤
    if (type == "out_order" && filter_clientName) {
        filter_sql_query += ` AND client.name LIKE "%${filter_clientName}%"`
    }

    // 根据配方库存



    //查询类型处理

    if (type == "in_order") {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS productRecordIn.id,productStock.name,productStock.type,amount,updata_date,nick,stock_id,materialRecipe
        FROM productRecordIn,productStock,users
        WHERE productRecordIn.stock_id = productStock.id AND productRecordIn.user_id=users.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    } else {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS productRecordOut.id,productStock.name,productStock.type,stock_id,productRecordOut.price,productRecordOut.amount,client.name AS 'client',client.tel AS client_tel,client.address AS client_address,updata_date,nick
        FROM productRecordOut,productStock,users,client
        WHERE client_id = client.id AND productRecordOut.stock_id = productStock.id AND productRecordOut.user_id=users.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    }

    return global.sql_query(sql_query)
}

// 查询原料出入库记录
exports.get_stockMaterialRecording = (type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, is_limit = true, is_finishDate = false, out_type) => {
    // 分页器偏移量
    let offset = (page - 1) * 20
    let sql_query, filter_sql_query = ""

    let limit_sql_query = `LIMIT 0,300000`
    if (is_limit) {
        limit_sql_query = `LIMIT ${offset},20`
    }



    //名称、类型过滤处理
    if (filter_name) filter_sql_query += ` AND materialStock.name="${filter_name}"`
    if (filter_type) filter_sql_query += ` AND materialStock.type="${filter_type}"`
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




    // //客户ID过滤(废弃)
    // if (type == "out_order" && filter_clientId) {
    //     filter_sql_query += `AND client_id = ${filter_clientId}`
    // }

    //出库类型过滤
    if (type == "out_order" && out_type) {
        filter_sql_query += ` AND materialRecordOut.out_type = ${out_type}`
    }


    //客户名模糊过滤1
    if (filter_clientName) {
        filter_sql_query += ` AND client.name LIKE "%${filter_clientName}%"`
    }

    //查询类型处理

    if (type == "in_order") {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS materialRecordIn.id,materialStock.name,materialStock.type,materialStock.price,amount,updata_date,materialStock.price*amount AS total_cost,nick,client.name AS 'client',client.tel AS client_tel,client.address AS client_address
        FROM materialRecordIn,materialStock,users,client
        WHERE client_id = client.id AND materialRecordIn.stock_id = materialStock.id AND materialRecordIn.user_id=users.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    } else {
        sql_query = `SELECT SQL_CALC_FOUND_ROWS materialRecordOut.id,materialStock.name,materialStock.type,stock_id,materialStock.price as price,amount,client.name AS 'client',client.tel AS client_tel,client.address AS client_address,updata_date,nick,out_type
        FROM materialRecordOut,materialStock,users,client
        WHERE materialRecordOut.client_id = client.id  AND materialRecordOut.stock_id = materialStock.id AND materialRecordOut.user_id=users.id ${filter_sql_query}
        ORDER BY ${order_by} ${direction}
        ${limit_sql_query}`
    }

    return global.sql_query(sql_query)
}


exports.get_storeOptions = (max_amount = 500, type) => {

    let tableName
    switch (type) {
        case "1": {
            tableName = "materialStock"
            break
        }

        case "2": {
            tableName = "productStock"
            break
        }
    }

    let sql_query = `SELECT id,name,type FROM ${tableName}
    LIMIT 0,${max_amount}`
    return global.sql_query(sql_query)
}
exports.get_transportStatusOptions = () => {
    return global.sql_query(`SELECT * FROM order_status`)
}


//原料变动库存(在原有基础上增删改)
//1.直接变动：直接对库存增删查改
//2.间接变动：撤销删除出入库记录 修改更改出入库记录
exports.modify_stock_material = async (type, stock_id, amount) => {
    //type:cover,add,reduce
    //stock_id:变动id
    //amount:变动数量
    //验证stock_id合法性,以及获取修改前的数量
    let sql_query = `SELECT id,stock FROM materialStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    if (!sql_result.length) return Promise.resolve(false)
    let cur_stock = sql_result[0].stock
    let modify_sql_query;
    switch (type) {
        case "add":
            modify_sql_query = `UPDATE materialStock
            SET stock = ${cur_stock + amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "reduce":
            modify_sql_query = `UPDATE materialStock
            SET stock = ${cur_stock - amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "cover":
            modify_sql_query = `UPDATE materialStock 
            SET stock = ${amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        default:
            return Promise.resolve(false)
    }


    return global.sql_query(modify_sql_query)
}

//成品变动库存
exports.modify_stock_product = async (type, stock_id, amount) => {
    //type:cover,add,reduce
    //stock_id:变动id
    //amount:变动数量
    //验证stock_id合法性,以及获取修改前的数量
    let sql_query = `SELECT id,stock FROM productStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    if (!sql_result.length) return Promise.resolve(false)
    let cur_stock = sql_result[0].stock
    let modify_sql_query;
    switch (type) {
        case "add":
            modify_sql_query = `UPDATE productStock
            SET stock = ${cur_stock + amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "reduce":
            modify_sql_query = `UPDATE productStock
            SET stock = ${cur_stock - amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        case "cover":
            modify_sql_query = `UPDATE productStock 
            SET stock = ${amount}, last_updata = CURRENT_TIMESTAMP()
            WHERE id = ${stock_id}`
            break
        default:
            return Promise.resolve(false)
    }


    return global.sql_query(modify_sql_query)
}



//新增材料出入库记录
exports.add_stock_recording_material = async (type, payload) => {
    //type:出/入库记录 in_stock,out_stock
    //payload:相关字段
    let sql_query
    if (type == "in_stock") sql_query = `INSERT INTO materialRecordIn(stock_id,amount,updata_date,user_id,client_id)
    VALUES(${payload.stock_id},${payload.amount},${payload.updata_date},${payload.user_id},${payload.client_id})`
    if (type == "out_stock") sql_query = `INSERT INTO materialRecordOut(stock_id,amount,client_id,updata_date,user_id,out_type)
    VALUES(${payload.stock_id},${payload.amount},${payload.client_id},${payload.updata_date},${payload.user_id},${payload.out_type})`
    return global.sql_query(sql_query)

}
//新增成品出入库记录
exports.add_stock_recording_product = async (type, payload) => {
    //type:出/入库记录 in_stock,out_stock
    //payload:相关字段
    let sql_query
    if (type == "in_stock") sql_query = `INSERT INTO productRecordIn(stock_id,amount,updata_date,user_id)
    VALUES(${payload.stock_id},${payload.amount},${payload.updata_date},${payload.user_id})`
    if (type == "out_stock") sql_query = `INSERT INTO productRecordOut(stock_id,amount,client_id,updata_date,user_id,price)
    VALUES(${payload.stock_id},${payload.amount},${payload.client_id},${payload.updata_date},${payload.user_id},${payload.price})`
    return global.sql_query(sql_query)

}




//新增材料库存
exports.add_material_stock = async (name, type, stock, price) => {
    //验证是否存在冲突
    let exist_sql_query = `SELECT * FROM materialStock
    WHERE name ="${name}" AND type = "${type}"`
    let exist_result = await global.sql_query(exist_sql_query)
    if (exist_result.length) return Promise.resolve(false)





    let sql_query = `INSERT INTO materialStock(name,type,stock,price,last_updata)
    VALUES("${name}","${type}",${stock},${price},CURRENT_TIMESTAMP())`





    return global.sql_query(sql_query)
}
exports.add_product_stock = async (name, type, stock, materialRecipe) => {
    //验证是否存在冲突
    let exist_sql_query = `SELECT * FROM productStock
        WHERE name ="${name}" AND type = "${type}"`
    let exist_result = await global.sql_query(exist_sql_query)
    if (exist_result.length) return Promise.resolve(false)
    let sql_query = `INSERT INTO productStock(name,type,stock,materialRecipe,last_updata)
        VALUES("${name}","${type}",${stock},'${JSON.stringify(materialRecipe)}',CURRENT_TIMESTAMP())`
    return global.sql_query(sql_query)

}
//编辑材料库存
exports.edit_material_stock = (stock_id, name, type, stock, price, des) => {
    let setQuery = ""
    if (name) setQuery += `${setQuery ? ',' : ""}name = '${name}'`
    if (type) setQuery += `${setQuery ? ',' : ""}type = '${type}'`
    if (stock || stock == 0) setQuery += `${setQuery ? ',' : ""}stock = ${stock}`
    if (price) setQuery += `${setQuery ? ',' : ""}price = ${price}`
    if (des) setQuery += `${setQuery ? ',' : ""}des = '${des}'`
    let sql_query = `UPDATE materialStock
    SET ${setQuery}
    WHERE id = ${stock_id}`

    return global.sql_query(sql_query)
}

//编辑成品库存
exports.edit_product_stock = (stock_id, name, type, stock, des) => {
    let setQuery = ""
    if (name) setQuery += `${setQuery ? ',' : ""}name = '${name}'`
    if (type) setQuery += `${setQuery ? ',' : ""}type = '${type}'`
    if (stock || stock == 0) setQuery += `${setQuery ? ',' : ""}stock = ${stock}`
    if (des) setQuery += `${setQuery ? ',' : ""}des = '${des}'`
    let sql_query = `UPDATE productStock
    SET ${setQuery}
    WHERE id = ${stock_id}`

    return global.sql_query(sql_query)
}


//删除材料库存
exports.del_material_stock = (stock_id) => {
    let sql_query = `DELETE FROM materialStock
    WHERE id = ${stock_id};`
    return global.sql_query(sql_query)
}
//删除成品库存
exports.del_product_stock = (stock_id) => {
    let sql_query = `DELETE FROM productStock
    WHERE id = ${stock_id};`
    return global.sql_query(sql_query)
}


//验证材料ID合法
exports.ruled_material_stock_id = (stock_id) => {
    let sql_query = `SELECT * FROM materialStock
    WHERE id = ${stock_id}`
    return global.sql_query(sql_query)

}

//验证成品ID合法
exports.ruled_product_stock_id = (stock_id) => {
    let sql_query = `SELECT * FROM productStock
    WHERE id = ${stock_id}`
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


exports.$checkMaterialEnough = async (stock_id, recipeAmount, amount) => {
    let sql_query = `SELECT stock,name,type FROM materialStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)

    return { ret: sql_result[0].stock - (recipeAmount * amount), name: sql_result[0].name, type: sql_result[0].type, }
}

//查询成品的原料配方
exports.$get_product_recipe = async (stock_id) => {
    let sql_query = `SELECT materialRecipe FROM productStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    sql_result = JSON.parse(sql_result[0].materialRecipe)

    return sql_result
}

//获取当前材料库存
exports.$get_curMaterialStock = async (stock_id) => {
    let sql_query = `SELECT stock FROM materialStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    return sql_result[0].stock
}
//获取当前材料平均成本
exports.$get_curMaterialPrice = async (stock_id) => {
    let sql_query = `SELECT price FROM materialStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    if (sql_result[0]) {
        return sql_result[0].price
    } else {
        return 0
    }

}
//设置当前材料平均成本
exports.$set_curMaterialPrice = async (stock_id, price) => {
    let sql_query = `UPDATE materialStock
    SET price = ${price}
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    return sql_result
}

//获取当前成品库存
exports.$get_curProductStock = async (stock_id) => {
    let sql_query = `SELECT stock FROM productStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    return sql_result[0].stock
}
//获取当前材料平均成本
exports.$get_curProductPrice = async (stock_id) => {
    let sql_query = `SELECT price FROM productStock
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    return sql_result[0].price
}

//设置当前材料平均成本
exports.$set_curProductPrice = async (stock_id, price) => {
    let sql_query = `UPDATE productStock
    SET price = ${price}
    WHERE id = ${stock_id}`
    let sql_result = await global.sql_query(sql_query)
    return sql_result
}
