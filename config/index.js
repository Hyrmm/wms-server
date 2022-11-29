module.exports = {
    // jwt密钥

    jwt_config: {
        secretKey: 'hyrm_wms',
        algorithms: ["HS256"]
    },
    secretKey: 'hyrm_wms',
    dataBaseConfig: {
        host: 'sh-cynosdbmysql-grp-qbmsgrx2.sql.tencentcdb.com',
        port: "21051",
        user: 'root',
        password: 'Woshihanjun123',
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
        field_fail: {
            status: 301,
            msg: "缺少必填字段",
            data: {}
        },
        add_stock_fail: {
            status: 302,
            msg: "已存库存冲突",
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