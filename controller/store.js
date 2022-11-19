

const { store } = require("../model")

exports.get_stock = async (req, res) => {
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? req.query.page : 1
    let sql_result = await store.get_stock(order_by, direction, page)
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}





exports.get_stockRecording = async (req, res) => {
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? req.query.page : 1
    let type = req.query.type ? req.query.type : "in_order"
    let sql_result = await store.get_stockRecording(type, order_by, direction, page)
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}