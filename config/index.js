module.exports = {
    // jwt密钥

    jwt_config: {
        secretKey: 'hyrm_wms',
        algorithms: ["HS256"]
    },
    secretKey: 'hyrm_wms',
    dataBaseConfig: {
        host: 'localhost',
        port: "3306",
        user: 'root',
        password: 'woshihanjun123',
        database: 'wms'
    },
    res_data: {
        login_fail: {
            status: 400,
            msg: "账户或密码不正确",
            data: []
        },
        auth_fail: {
            status: 401,
            msg: "用户登录身份已失效",
            data: {}
        },
        route_fail: {
            status: 500,
            msg: "访问路径不存在",
            data: {}
        },
        query_fail: {
            status: 300,
            msg: "查询格式非法",
            data: {}
        }
    },
    pagination: {
        pageSize: 20
    }

}