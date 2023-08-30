

exports.login = (nick, password) => {
    return global.sql_query(`SELECT users.id,account,nick,role_name,latest_login FROM users,roles
    WHERE (account = "${nick}" and users.passward = "${password}") AND users.role_id = roles.id`)
}
// 查询Token是否过期
exports.get_revoked_token = (signature) => {
    let sql_query = `SELECT * FROM revoked_tokens
    WHERE signature = "${signature}"`
    return global.sql_query(sql_query)
}
// 记录失效Token
exports.add_revoked_token = (signature, user_id) => {
    let sql_query = `INSERT revoked_tokens(signature,user_id)
    VALUES("${signature}",${user_id})`
    return global.sql_query(sql_query)
}
// 查询用户信息
exports.get_userInfo = (user_id) => {
    let sql_query = `SELECT users.id,account,nick,role_name
    FROM users,roles
    WHERE users.id =${user_id} AND roles.id = role_id`
    return global.sql_query(sql_query)
}

