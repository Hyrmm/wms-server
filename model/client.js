exports.get_client = (page, filter_name, is_limit = false) => {

    // 分页器偏移量
    let sql_query
    let offset = (page - 1) * 20
    let limit_sql_query = ""
    if (is_limit) limit_sql_query = `LIMIT ${offset},20`


    //过滤条件不为空
    if (filter_name) {
        sql_query = `SELECT * FROM client
        WHERE name LIKE "%${filter_name}%"
        ORDER BY id DESC
        ${limit_sql_query}`
    } else {
        sql_query = `SELECT * FROM client
        ORDER BY id DESC
        ${limit_sql_query}`
    }



    return global.sql_query(sql_query)
}



exports.get_client_options = (max_amount = 1000) => {
    let sql_query = `SELECT id,name AS 'value' FROM client
    ORDER BY id DESC
    LIMIT 0,${1000}`
    return global.sql_query(sql_query)
}

exports.modify_client = (client_id, modify_name, modify_tel, modify_address) => {

    let modify_query = ""
    //存在条件性修改
    if (modify_name) modify_query += `${modify_query ? "," : ""} name = "${modify_name}"`
    if (modify_tel) modify_query += `${modify_query ? "," : ""} tel = "${modify_tel}"`
    if (modify_address) modify_query += `${modify_query ? "," : ""} address = "${modify_address}"`
    let sql_query = `UPDATE client
    SET ${modify_query}
    WHERE id = ${client_id}`
    return global.sql_query(sql_query)

}


exports.$get_client = (client_id) => {
    let sql_query = `SELECT * FROM client
    WHERE id = ${client_id}`
    return global.sql_query(sql_query)
}
exports.$get_client_byName = (client_name) => {
    let sql_query = `SELECT * FROM client
    WHERE name = "${client_name}"`
    return global.sql_query(sql_query)
}

exports.add_client = (name, tel, address) => {
    let sql_query = `INSERT INTO client (name,tel,address)
    VALUES ("${name}","${tel}","${address}");`
    return global.sql_query(sql_query)
}
exports.del_client = (client_id) => {
    let sql_query = `DELETE FROM client
    WHERE id = ${client_id}`
    return global.sql_query(sql_query)
}