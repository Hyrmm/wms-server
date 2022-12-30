
const { client } = require("../model")
const { res_data } = require("../config")
const { json } = require("express")


//查询客户
exports.get_client = async (req, res) => {

    let page = req.query.page ? req.query.page : 1
    let filter_name = req.query.filter_name ? req.query.filter_name : ""
    //过滤后总记录数
    let total_sql_result = await client.get_client(page, filter_name)
    let sql_result = await client.get_client(page, filter_name, true)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });
    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}
exports.get_client_options = async (req, res) => {
    let sql_result = await client.get_client_options()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}

//修改客户信息
exports.modify_client = async (req, res) => {
    let client_id, modify_name, modify_tel, modify_address
    client_id = req.body.client_id ? req.body.client_id : 0
    modify_name = req.body.modify_name ? req.body.modify_name : ""
    modify_tel = req.body.modify_tel ? req.body.modify_tel : ""
    modify_address = req.body.modify_address ? req.body.modify_address : ""
    //参数验证
    if (!client_id) return res.json(res_data.field_fail)

    //client_id合法性验证
    let sql_result = await client.$get_client(client_id)
    if (!sql_result.length) return res.json(res_data.modify_client_fail)

    sql_result = await client.modify_client(client_id, modify_name, modify_tel, modify_address)

    return res.json({ status: 200, msg: "修改成功", data: sql_result })
}
//新增客户
exports.add_client = async (req, res) => {

    let client_name = req.body.name
    let client_tel = req.body.tel
    let client_address = req.body.address
    //参数验证
    if (!(client_name && client_tel && client_address)) return res.json(res_data.field_fail)

    //验证用户是否重复
    let sql_result = await client.$get_client_byName(client_name)
    if (sql_result.length) return res.json(res_data.add_client_fail)

    sql_result = await client.add_client(client_name, client_tel, client_address)
    return res.json({ status: 200, msg: "新增成功", data: sql_result })
}
//删除客户
exports.del_client = async (req, res) => {
    let client_id = req.body.client_id
    //参数验证
    if (!client_id) return res.json(res_data.field_fail)

    //验证id合法性
    let sql_result = await client.$get_client(client_id)
    if (!sql_result.length) return res.json(res_data.modify_client_fail)

    sql_result = await client.del_client(client_id)
    return res.json({ status: 200, msg: "删除成功", data: sql_result })


}