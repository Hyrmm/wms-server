
const { store } = require("../model")
const { res_data } = require("../config")
const { formatDate } = require("../utils")
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


//查询出入库记录
exports.get_stockRecording = async (req, res) => {
    //参数初始化,过滤为空情况
    let page, type, order_by, direction, filter_name, filter_type, filter_date_start, filter_date_end, filter_clientId, filter_clientName
    order_by = req.query.order_by ? req.query.order_by : "id"
    direction = req.query.direction ? req.query.direction : "ASC"
    filter_name = req.query.filter_name ? req.query.filter_name : ""
    filter_type = req.query.filter_type ? req.query.filter_type : ""
    filter_clientId = req.query.filter_clientId ? req.query.filter_clientId : ""
    filter_clientName = req.query.filter_clientName ? req.query.filter_clientName : ""
    filter_date_start = req.query.filter_date_start ? req.query.filter_date_start : ""
    filter_date_end = req.query.filter_date_end ? req.query.filter_date_end : ""
    filter_transportStatus = req.query.filter_transportStatus ? req.query.filter_transportStatus : ""
    // type,page 必填参数,filter_data解析拦截
    page = req.query.page
    type = req.query.type
    if (!type || !page) return res.json(res_data.query_fail)
    // 过滤后总记录数
    let total_sql_result = await store.get_stockRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, false)
    // 分页结果
    let sql_result = await store.get_stockRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });
    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}
//查询库存可选项
exports.get_storeOptions = async (req, res) => {
    let sql_result = await store.get_storeOptions()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}
//查询订单状态
exports.get_transportStatusOptions = async (req, res) => {
    let sql_result = await store.get_transportStatusOptions()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}


//入库
exports.in_store = async (req, res) => {
    let stock_id = req.body.stock_id
    let price = req.body.price
    let amount = req.body.amount
    let updata_date = req.body.updata_date
    let user_id = req.auth.user_id
    //日期默认处理
    if (updata_date) {
        updata_date = `"${formatDate(new Date(updata_date))}"`
    } else {
        updata_date = "CURRENT_TIMESTAMP()"
    }
    //必填参数验证
    if (!(stock_id && price && amount)) return res.json(res_data.field_fail)
    //修改变动库存
    let sql_result = await store.modify_stock("add", stock_id, amount)
    if (!sql_result) return res.json(res_data.modify_store_fail)

    //生成入库记录
    let payload = { stock_id, price, amount, updata_date, user_id }
    let recording_result = await store.add_stock_recording("in_stock", payload)
    if (!recording_result) return res.json(res_data.modify_store_fail)

    return res.json({ status: 200, msg: "入库成功", data: {} })
}
//出库
exports.out_store = async (req, res) => {
    let stock_id = req.body.stock_id
    let price = req.body.price
    let amount = req.body.amount
    let another_fee = req.body.another_fee
    let client_id = req.body.client_id
    let transport_status = req.body.transport_status
    let transport_order = req.body.transport_order
    let updata_date = req.body.updata_date
    let user_id = req.auth.user_id
    //日期默认处理
    if (updata_date) {
        updata_date = `"${formatDate(new Date(updata_date))}"`
    } else {
        updata_date = "CURRENT_TIMESTAMP()"
    }
    //必填参数验证
    if (!(stock_id && price && amount && another_fee && client_id  && transport_status)) return res.json(res_data.field_fail)
    //修改变动库存
    //针对退回仓库订单状态 特殊处理,不去变动库存，maybe只是做记录处理?
    if (transport_order != 4) {
        let sql_result = await store.modify_stock("reduce", stock_id, amount)
        if (!sql_result) return res.json(res_data.modify_store_fail)
    }

    //生成入库记录
    let payload = { stock_id, price, amount, updata_date, another_fee, client_id, transport_order, transport_status, user_id }
    let recording_result = await store.add_stock_recording("out_stock", payload)
    if (!recording_result) return res.json(res_data.modify_store_fail)

    return res.json({ status: 200, msg: "出库成功", data: {} })

}

//新增库存
exports.add_store = async (req, res) => {
    let name = req.body.name
    let type = req.body.type
    let stock = req.body.stock

    //必填参数验证
    if (!(name && type && stock)) return res.json(res_data.field_fail)
    let sql_result = await store.add_stock(name, type, stock)
    //已存在库存冲突
    if (!sql_result) return res.json(res_data.add_stock_fail)
    return res.json({ status: 200, msg: "新增库存成功", data: sql_result })
}

//更改出库状态
exports.modify_out_store_status = async (req, res) => {
    let order_id = req.body.order_id
    let modify_status = req.body.modify_status

    //必填参数验证 数据类型验证
    if (!(order_id && modify_status && typeof modify_status == "number")) return res.json(res_data.field_fail)
    let sql_result = await store.ruled_transport_status(modify_status)
    if (!sql_result.length) return res.json(res_data.field_fail)

    //获取原订单状态 stock_id
    let { ori_status, stock_id, amount } = (await store.$get_out_store_recording(order_id))[0]

    //验证要变更状态是否为合法状态id
    sql_result = await store.modify_out_store_status(order_id, modify_status)
    if (!sql_result.affectedRows) return res.json(res_data.modify_store_fail)

    //变动库存
    if (ori_status == 4 && modify_status != 4) {
        //退回仓库=>任意状态 当作首次出库处理，对应仓库商品数量减少
        sql_result = await store.modify_stock('reduce', stock_id, amount)
    } else if (modify_status == 4 && ori_status != 4) {
        //任意状态=>退回仓库 对应仓库商品的数量修正(增加)
        sql_result = await store.modify_stock('add', stock_id, amount)
    }

    //生成订单完成时间
    //其他未完成状态=>完成状态(完成收货、退回仓库、退回原厂) 生成时间
    //完成状态(完成收货、退回仓库、退回原厂)=>其他状态 修正成默认值
    if ((ori_status == 1 || ori_status == 2) && (modify_status == 3 || modify_status == 4 || modify_status == 5)) {
        sql_result = await store.$set_out_store_finish_date(order_id)
    } else if ((ori_status == 3 || ori_status == 4 || ori_status == 5) && (modify_status == 1 || modify_status == 2)) {
        sql_result = await store.$set_out_store_finish_date(order_id, "NULL")
    }


    return res.json({ status: 200, msg: "修改成功", data: {} })
}

