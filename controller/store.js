

const { store } = require("../model")
const { res_data } = require("../config")
exports.get_stock = async (req, res) => {
    // 拦截未传或为空的参数
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? Number(req.query.page) : 1
    let name = req.query.name ? req.query.name : ""
    // 过滤后总记录数
    let total_sql_result = await store.get_stock(order_by, direction, page, name, false)
    // 分页结果
    let sql_result = await store.get_stock(order_by, direction, page, name)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });


    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}





exports.get_stockRecording = async (req, res) => {
    //参数初始化,过滤为空情况
    let page, type, order_by, direction, filter_name, filter_type, filter_date_start, filter_date_end
    order_by = req.query.order_by ? req.query.order_by : "id"
    direction = req.query.direction ? req.query.direction : "ASC"
    filter_name = req.query.filter_name ? req.query.filter_name : ""
    filter_type = req.query.filter_type ? req.query.filter_type : ""
    filter_date_start = req.query.filter_date_start ? req.query.filter_date_start : ""
    filter_date_end = req.query.filter_date_end ? req.query.filter_date_end : ""
    // type,page 必填参数,filter_data解析拦截
    page = req.query.page
    type = req.query.type
    if (!type || !page) return res.json(res_data.query_fail)
    // 过滤后总记录数
    let total_sql_result = await store.get_stockRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, false)
    // 分页结果
    let sql_result = await store.get_stockRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });
    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}

exports.get_storeOptions = async (req, res) => {
    let sql_result = await store.get_storeOptions()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}