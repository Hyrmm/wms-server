
const { store } = require("../model")
const { res_data } = require("../config")
const { formatDate } = require("../utils")
const { pinyin } = require("pinyin-pro")
exports.get_stock = async (req, res) => {
    // 拦截未传或为空的参数
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? Number(req.query.page) : 1
    let name = req.query.name ? req.query.name : ""
    let type = req.query.type ? req.query.type : ""
    let nullStock = req.query.nullStock ? req.query.nullStock : true
    // 过滤后总记录数
    let total_sql_result = await store.get_stock(order_by, direction, page, name, false, type, nullStock)
    // 分页结果
    let sql_result = await store.get_stock(order_by, direction, page, name, false, type, nullStock)

    // 首字母排序
    sql_result = sql_result.sort((pre, next) => {
        const prePY = pinyin(pre.name[0], { toneType: 'none' })[0].toLocaleLowerCase()
        const nextPY = pinyin(next.name[0], { toneType: 'none' })[0].toLocaleLowerCase()
        return prePY.charCodeAt() - nextPY.charCodeAt()
    })
    // 分页
    sql_result = sql_result.slice((page - 1) * 20, (page - 1) * 20 + 20)

    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });

    // 针对成品库存计算价格
    if (type == 2) {

        for (const record of sql_result) {
            let price = 0
            const recipes = JSON.parse(record.materialRecipe)
            for (const recipe of recipes) {
                const recipeAmount = recipe.amount
                const recipePrice = await store.$get_curMaterialPrice(recipe.stockId)
                price += recipeAmount * recipePrice
            }
            record.price = price
        }

    }



    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}
exports.get_all_stock = async (req, res) => {
    // 拦截未传或为空的参数
    let order_by = req.query.order_by ? req.query.order_by : "id"
    let direction = req.query.direction ? req.query.direction : "ASC"
    let page = req.query.page ? Number(req.query.page) : 1
    let name = req.query.name ? req.query.name : ""
    let type = req.query.type ? req.query.type : ""
    // 过滤后总记录数
    let total_sql_result = await store.get_stock(order_by, direction, page, name, false, type)
    // 分页结果
    let sql_result = await store.get_stock(order_by, direction, page, name, false, type)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });

    // 针对成品库存计算价格
    if (type == 2) {

        for (const record of sql_result) {
            let price = 0
            const recipes = JSON.parse(record.materialRecipe)
            for (const recipe of recipes) {
                const recipeAmount = recipe.amount
                const recipePrice = await store.$get_curMaterialPrice(recipe.stockId)
                price += recipeAmount * recipePrice
            }
            record.price = price
        }

    }



    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}


//查询原料出入库记录
exports.get_material_stockRecording = async (req, res) => {
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
    out_type = req.query.out_type ? req.query.out_type : ""
    // type,page 必填参数,filter_data解析拦截
    page = req.query.page
    type = req.query.type
    if (!type || !page) return res.json(res_data.query_fail)
    // 过滤后总记录数
    let total_sql_result = await store.get_stockMaterialRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, false, false, out_type)
    // 分页结果
    let sql_result = await store.get_stockMaterialRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, true, false, out_type)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });
    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}
//查询成品出入库记录
exports.get_product_stockRecording = async (req, res) => {
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
    let total_sql_result = await store.get_stockProductRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName, false)
    // 分页结果
    let sql_result = await store.get_stockProductRecording(type, order_by, direction, page, filter_name, filter_type, filter_date_start, filter_date_end, filter_transportStatus, filter_clientId, filter_clientName)
    //标记索引
    sql_result.forEach((element, index) => {
        element.index = (Number(page) - 1) * 20 + index + 1
    });


    // 根据配方获取出库、入库的成本
    for (const record of sql_result) {

        let cost = 0
        const recipes = await store.$get_product_recipe(record.stock_id)
        for (const recipe of recipes) {
            const amount = recipe.amount
            const materialStockId = recipe.stockId
            const prePrice = await store.$get_curMaterialPrice(materialStockId)
            cost += prePrice * amount
        }


        if (type == "out_order") {
            record.cost = cost
        } else {
            record.price = cost
            record.total_cost = cost * record.amount
        }
    }

    return res.json({ status: 200, msg: "查询成功", current_page: Number(page), total: total_sql_result.length, data: sql_result })
}





//查询库存可选项
exports.get_storeOptions = async (req, res) => {
    const allTypes = req.body.types
    const returnData = {}
    for (type of allTypes) {
        let sql_result = await store.get_storeOptions(500, type)
        returnData[type] = sql_result
    }
    return res.json({ status: 200, msg: "查询成功", data: returnData })
}
//查询订单状态
exports.get_transportStatusOptions = async (req, res) => {
    let sql_result = await store.get_transportStatusOptions()
    return res.json({ status: 200, msg: "查询成功", data: sql_result })
}


//材料入库
exports.in_store_material = async (req, res) => {
    let stock_id = req.body.stock_id
    let amount = req.body.amount
    let updata_date = req.body.updata_date
    let user_id = req.auth.user_id
    let client_id = req.body.client_id
    //日期默认处理
    if (updata_date) {
        updata_date = `"${formatDate(new Date(updata_date))}"`
    } else {
        updata_date = "CURRENT_TIMESTAMP()"
    }
    //必填参数验证
    if (!(stock_id && amount, client_id)) return res.json(res_data.field_fail)

    //当前平均成本记录
    // let cur_materialStock = await store.$get_curMaterialStock(stock_id)
    // let cur_materialPrice = await store.$get_curMaterialPrice(stock_id)
    // const updataPrice = ((cur_materialStock * cur_materialPrice) + (amount * price)) / (amount + cur_materialStock)
    // let sql_result = await store.$set_curMaterialPrice(stock_id, updataPrice)


    //修改变动库存
    sql_result = await store.modify_stock_material("add", stock_id, amount)
    if (!sql_result) return res.json(res_data.modify_store_fail)

    //生成入库记录
    let payload = { stock_id, amount, updata_date, user_id, client_id }
    let recording_result = await store.add_stock_recording_material("in_stock", payload)
    if (!recording_result) return res.json(res_data.modify_store_fail)

    return res.json({ status: 200, msg: "入库成功", data: {} })
}
//成品入库
exports.in_store_product = async (req, res) => {
    let stock_id = req.body.stock_id
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
    if (!(stock_id && amount)) return res.json(res_data.field_fail)

    //id合法验证
    let sql_result = store.ruled_product_stock_id(stock_id)
    if (!sql_result) return res.json(res_data.field_fail)




    // 查配方
    const recipeList = await store.$get_product_recipe(stock_id)


    // 检查配方中原料是否充足

    for (const recipe of recipeList) {
        let sql_result = await store.$checkMaterialEnough(recipe.stockId, recipe.amount, amount)
        if (sql_result.ret < 0) {
            return res.json({ status: 404, msg: `原料(${sql_result.name}/${sql_result.type})库存不足`, data: {} })
        }
    }


    // // 平均库存成本价
    // const curProductStock = await store.$get_curProductStock(stock_id)
    // const curProductPrice = await store.$get_curProductPrice(stock_id)
    // let curCost = 0
    // for (const recipe of recipeList) {
    //     const curRecipePrice = await store.$get_curMaterialPrice(recipe.stockId)
    //     curCost += (amount * recipe.amount * curRecipePrice)
    // }
    // const updataPrice = ((curProductPrice * curProductStock) + curCost) / (curProductStock + amount)
    // sql_result = await store.$set_curProductPrice(stock_id, updataPrice)



    for (const recipe of recipeList) {
        // 减少原料库存
        let sql_result = await store.modify_stock_material('reduce', recipe.stockId, recipe.amount * amount)
        // 生成原料出库记录
        const payload = { stock_id: recipe.stockId, amount: amount * recipe.amount, updata_date, user_id, client_id: 1, out_type: 2 }
        sql_result = await store.add_stock_recording_material('out_stock', payload)

    }


    //变动成品库存
    sql_result = await store.modify_stock_product("add", stock_id, amount)
    if (!sql_result) return res.json(res_data.modify_store_fail)

    //生成成品入库记录
    sql_result = await store.add_stock_recording_product("in_stock", { stock_id, amount, updata_date, user_id })

    return res.json({ status: 200, msg: "入库成功", data: {} })



}

//材料出库
exports.out_store_material = async (req, res) => {
    let stock_id = req.body.stock_id
    let amount = req.body.amount
    let client_id = req.body.client_id
    let updata_date = req.body.updata_date
    let user_id = req.auth.user_id
    let out_type = req.body.out_type
    //日期默认处理
    if (updata_date) {
        updata_date = `"${formatDate(new Date(updata_date))}"`
    } else {
        updata_date = "CURRENT_TIMESTAMP()"
    }

    //必填参数验证
    if (!(stock_id && amount)) return res.json(res_data.field_fail)


    //库存数量验证
    const materialStock = await store.$get_curMaterialStock(stock_id)
    if (materialStock < amount) return res.json({ status: 404, msg: "材料库存不足", data: {} })
    let payload
    switch (out_type) {
        // 退货 （做成本平均处理）
        case 1: {
            if (!(client_id)) return res.json(res_data.field_fail)
            // const materialStock = await store.$get_curMaterialStock(stock_id)//94
            // const materialPrice = await store.$get_curMaterialPrice(stock_id)//1
            // const curTotalCost = materialPrice * materialStock //94


            // const updataPrice = (curTotalCost - (price * amount)) / (materialStock - amount)
            // let sql_result = await store.$set_curMaterialPrice(stock_id, updataPrice)
            sql_result = await store.modify_stock_material("reduce", stock_id, amount)
            if (!sql_result) return res.json(res_data.modify_store_fail)
            payload = { stock_id, amount, updata_date, client_id, user_id, out_type }
            break
        }
        // 损坏（只做库存减少处理）
        case 3: {
            // const materialPrice = await store.$get_curMaterialPrice(stock_id)
            let sql_result = await store.modify_stock_material("reduce", stock_id, amount)
            if (!sql_result) return res.json(res_data.modify_store_fail)
            payload = { stock_id, amount, updata_date, client_id: 1, user_id, out_type }
            break
        }
    }


    //生成出库记录
    let recording_result = await store.add_stock_recording_material("out_stock", payload)
    if (!recording_result) return res.json(res_data.modify_store_fail)

    return res.json({ status: 200, msg: "出库成功", data: {} })

}
//成品出库
exports.out_store_product = async (req, res) => {
    let stock_id = req.body.stock_id
    let amount = req.body.amount
    let client_id = req.body.client_id
    let updata_date = req.body.updata_date
    let user_id = req.auth.user_id
    let price = req.body.price

    //日期默认处理
    if (updata_date) {
        updata_date = `"${formatDate(new Date(updata_date))}"`
    } else {
        updata_date = "CURRENT_TIMESTAMP()"
    }

    //库存数量验证
    const curProductStock = await store.$get_curProductStock(stock_id)
    if (curProductStock < amount) return res.json({ status: 404, msg: "成品库存不足", data: {} })

    //减少库存
    let sql_result = await store.modify_stock_product("reduce", stock_id, amount)

    //生成出库记录
    const payload = { stock_id, amount, client_id, updata_date, user_id, price }
    let recording_result = await store.add_stock_recording_product("out_stock", payload)

    if (!recording_result) return res.json(res_data.modify_store_fail)

    return res.json({ status: 200, msg: "出库成功", data: {} })

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
//新增材料库存
exports.add_material_store = async (req, res) => {
    let name = req.body.name
    let type = req.body.type
    let stock = req.body.stock
    let price = req.body.price

    //必填参数验证
    if (!(name && type && stock != undefined)) return res.json(res_data.field_fail)
    let sql_result = await store.add_material_stock(name, type, stock, price)
    //已存在库存冲突

    if (!sql_result) return res.json(res_data.add_stock_fail)
    return res.json({ status: 200, msg: "新增库存成功", data: sql_result })
}
//新增成品库存
exports.add_product_store = async (req, res) => {
    let name = req.body.name
    let type = req.body.type
    let stock = req.body.stock
    let materialRecipe = req.body.materialRecipe

    //必填参数验证
    if (!(name && type && stock != undefined)) return res.json(res_data.field_fail)
    let sql_result = await store.add_product_stock(name, type, stock, materialRecipe)
    if (!sql_result) return res.json(res_data.add_stock_fail)
    return res.json({ status: 200, msg: "新增库存成功", data: sql_result })
}
//编辑材料库存
exports.edit_material_store = async (req, res) => {
    let stock_id = req.body.stockId
    let edit_name = req.body.name
    let edit_type = req.body.type
    let edit_stock = req.body.stock
    let edit_price = req.body.price
    let edit_des = req.body.des
    //验证必填参数
    if (!stock_id) return res.json(res_data.field_fail)

    //验证stock_id合法
    let sql_result = await store.ruled_material_stock_id(stock_id)
    if (!sql_result.length) return res.json({ status: 200, msg: "库存不存在", data: sql_result })

    sql_result = await store.edit_material_stock(stock_id, edit_name, edit_type, edit_stock, edit_price, edit_des)
    return res.json({ status: 200, msg: "编辑库存成功", data: sql_result })
}
//编辑成品库存
exports.edit_product_store = async (req, res) => {
    let stock_id = req.body.stockId
    let edit_name = req.body.name
    let edit_type = req.body.type
    let edit_stock = req.body.stock
    let edit_des = req.body.des
    //验证必填参数
    if (!stock_id) return res.json(res_data.field_fail)

    //验证stock_id合法
    let sql_result = await store.ruled_product_stock_id(stock_id)
    if (!sql_result.length) return res.json({ status: 200, msg: "库存不存在", data: sql_result })

    sql_result = await store.edit_product_stock(stock_id, edit_name, edit_type, edit_stock)
    return res.json({ status: 200, msg: "编辑库存成功", data: sql_result })
}
//删除材料库存
exports.del_material_store = async (req, res) => {
    let stock_id = req.body.stockId
    //验证必填参数
    if (!stock_id) return res.json(res_data.field_fail)
    //验证stock_id合法
    let sql_result = await store.ruled_material_stock_id(stock_id)
    if (!sql_result.length) return res.json({ status: 200, msg: "库存不存在", data: sql_result })

    sql_result = await store.del_material_stock(stock_id)



    return res.json({ status: 200, msg: "删除成功", data: sql_result })
}
//删除成品库存
exports.del_product_store = async (req, res) => {
    let stock_id = req.body.stockId
    //验证必填参数
    if (!stock_id) return res.json(res_data.field_fail)
    //验证stock_id合法
    let sql_result = await store.ruled_product_stock_id(stock_id)
    if (!sql_result.length) return res.json({ status: 200, msg: "库存不存在", data: sql_result })

    sql_result = await store.del_product_stock(stock_id)



    return res.json({ status: 200, msg: "删除成功", data: sql_result })
}




