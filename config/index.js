/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-11-02 20:34:03
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2023-01-05 16:19:03
 * @FilePath: \wms-server\config\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
    // jwt密钥
    jwt_config: {
        secretKey: 'hyrm_wms',
        algorithms: ["HS256"]
    },
    dataBaseConfig: {
        host: '数据库地址',
        port: "端口",
        user: '用户名',
        password: '密码',
        database: '数据库名称'
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
            msg: "字段验证失败",
            data: {}
        },
        add_stock_fail: {
            status: 302,
            msg: "已存库存冲突",
            data: {}
        },
        modify_store_fail: {
            status: 303,
            msg: "库存变动失败",
            data: {}
        },
        modify_client_fail: {
            status: 304,
            msg: "客户不存在",
            data: {}
        },
        add_client_fail: {
            status: 305,
            msg: "客户已存在",
            data: {}
        }

    },
    pagination: {
        pageSize: 20
    }

}