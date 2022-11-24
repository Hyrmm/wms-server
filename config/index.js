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
        auth_fail: {
            status: 401,
            msg: "用户登录身份已失效",
            data: {}
        },
        login_fail: {
            status: 400,
            msg: "账户或密码不正确",
            data: []
        },
        route_fail: {
            status: 500,
            msg: "访问路径不存在",
            data: {}
        },
        route_dev: {
            status: 501,
            msg: "接口正在维护",
            data: {}
        },
        query_fail: {
            status: 300,
            msg: "查询格式非法",
            data: {}
        },
        modify_fail: {
            status: 600,
            msg: "变更数据失败",
            data: {}
        }
    },
    pagination: {
        pageSize: 20
    }

}