

exports.login = (nick, password) => {
    return global.sql_query(`SELECT nick,role_name,updata_date FROM users,roles
    WHERE (nick = "${nick}" and users.passward = "${password}") AND users.role_id = roles.id`)
}



