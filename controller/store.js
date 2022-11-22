

const { store } = require("../model")
const { res_data } = require("../config")
exports.get_stock = async (req, res) => {
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? req.query.page : 1
    let sql_result = await store.get_stock(order_by, direction, page)
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}





exports.get_stockRecording = async (req, res) => {
    let page, type, order_by, direction, filter, filter_data

    // type,page 必填参数,filter_data解析拦截
    page = req.query.page
    type = req.query.type
    if (!type || !page) return res.json(res_data.query_fail)


    try {
        filter = req.query.filter ? req.query.filter : false
        if (filter) {
            filter_data = JSON.parse(req.query.filter_data)
        } else {
            filter_data = ''
        }
    } catch (error) {
        console.log(error)
        return res.json(res_data.query_fail)
    }

    order_by = req.query.order_by ? req.query.order_by : "id"
    direction = req.query.direction ? req.query.direction : "ASC"
    let sql_result = await store.get_stockRecording(type, order_by, direction, page, filter, filter_data)
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}

exports.get_storeOptions = async (req, res) => {
    let sql_result = await store.get_storeOptions()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}