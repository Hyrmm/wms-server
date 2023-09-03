/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-12-06 19:02:13
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2023-01-22 00:19:36
 * @FilePath: \wms-server\controller\dataVisual.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%
 */
const { dataVisual, store } = require("../model")
const { get_stockProductRecording } = require("../model/store")
const { res_data } = require("../config")



exports.get_common_info = async (req, res) => {
    //获取材料总库存
    var stocks_sql_result = await dataVisual.get_total_stock(1)
    let material_total_stocks = stocks_sql_result[0].total

    //获取材料总库存
    var stocks_sql_result = await dataVisual.get_total_stock(2)
    let product_total_stocks = stocks_sql_result[0].total

    //获取材料出库总记录
    var outOrder_sql_result = await dataVisual.get_total_outOrder(1)
    let material_total_outOrder = outOrder_sql_result[0].total

    //获取成品出库总记录
    var outOrder_sql_result = await dataVisual.get_total_outOrder(2)
    let product_total_outOrder = outOrder_sql_result[0].total

    //获取材料入库总记录
    var inOrder_sql_result = await dataVisual.get_total_inOrder(1)
    let material_total_inOrder = inOrder_sql_result[0].total

    //获取成品入库总记录
    var inOrder_sql_result = await dataVisual.get_total_inOrder(2)
    let product_total_inOrder = inOrder_sql_result[0].total


    //获取总客户
    let client_sql_result = await dataVisual.get_total_client()
    let total_client = client_sql_result[0].total
    return res.json({
        status: 200, msg: "获取成功", data: {
            material_total_stocks,
            product_total_stocks,
            material_total_outOrder,
            product_total_outOrder,
            material_total_inOrder,
            product_total_inOrder,
            total_client
        }
    })
}

exports.get_storeInfo = async (req, res) => {
    let sql_result = await dataVisual.get_store()
    let cache = {}
    let options = []
    for (let item of sql_result) {
        if (cache[item.name]) {
            //有缓存
            let index = cache[item.name].index
            options[index].children.push({ name: item.type, value: item.stock })
            options[index].value += item.stock

        } else {
            //首次推入数据以及记录位置
            let index = options.push({ name: item.name, value: item.stock, children: [{ name: item.type, value: item.stock }] }) - 1
            //记录缓存
            cache[item.name] = { name: item.name, index: index }
        }
    }
    return res.json({ status: 200, msg: "获取成功", data: options })
}
exports.get_salesInfo = async (req, res) => {
    let year = req.query.year
    let month = req.query.month
    let filter_date_start, filter_date_end

    let chartsData = {}
    let clientRank = {}
    let categoriesPerCache = {}
    let categoriesPerTemp = []
    let categoriesPer = { totalSales: 0, totalCost: 0, totalProfit: 0, sales: [], cost: [], profit: [], }

    //查询所有数据
    if (year) {
        filter_date_start = `${year}-${month ? month : 1}-1`
        filter_date_end = `${year}-${month ? month : 12}-31`
    }
    let sql_result = await get_stockProductRecording("out_order", "id", "ASC", 1, "", "", filter_date_start, filter_date_end, "", "", "", false, false)
    let total = sql_result.length
    if (month) {
        chartsData.xData = Array.from(new Array(31), (element, index) => index + 1)
        chartsData.salesData = Array.from(new Array(31), ele => 0)
        chartsData.costData = Array.from(new Array(31), ele => 0)
        chartsData.profitData = Array.from(new Array(31), ele => 0)
        //数据处理
        for (let item of sql_result) {
            //销售额
            chartsData.salesData[new Date(item.finish_date).getDate() - 1] += item.amount * item.price

            //成本
            let cost = 0
            const recipes = await store.$get_product_recipe(item.stock_id)
            for (const recipe of recipes) {
                const materialPrice = await store.$get_curMaterialPrice(recipe.stockId)
                cost += materialPrice * recipe.amount
            }
            item.cost = cost * item.amount

            chartsData.costData[new Date(item.finish_date).getDate() - 1] += cost * item.amount

            //利润
            chartsData.profitData[new Date(item.finish_date).getDate() - 1] = + item.amount * item.price - cost * item.amount

            //销售额排名客户
            if (clientRank[item.client]) {
                clientRank[item.client] += item.amount * item.price
            } else {
                clientRank[item.client] = item.amount * item.price
            }

            //类别占比
            if (categoriesPerCache[item.stock_id]) {
                //有缓存
                let index = categoriesPerCache[item.stock_id]
                categoriesPerTemp[index].sales.value += item.amount * item.price
                categoriesPerTemp[index].cost.value += cost * item.amount
                categoriesPerTemp[index].profit.value += item.amount * item.price - cost * item.amount

            } else {
                //无缓存
                let index = categoriesPerTemp.push(
                    {
                        sales: { name: `${item.name}/${item.type}`, value: item.amount * item.price },
                        cost: { name: `${item.name}/${item.type}`, value: cost * item.amount },
                        profit: { name: `${item.name}/${item.type}`, value: item.amount * item.price - cost * item.amount }
                    }
                ) - 1
                categoriesPerCache[item.stock_id] = index
            }

        }

    } else {
        chartsData.xData = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月",]
        chartsData.salesData = Array.from(new Array(12), ele => 0)
        chartsData.costData = Array.from(new Array(12), ele => 0)
        chartsData.profitData = Array.from(new Array(12), ele => 0)
        //数据处理
        for (let item of sql_result) {
            //销售额
            chartsData.salesData[new Date(item.updata_date).getMonth()] += item.amount * item.price

            //成本
            let cost = 0
            const recipes = await store.$get_product_recipe(item.stock_id)
            for (const recipe of recipes) {
                const materialPrice = await store.$get_curMaterialPrice(recipe.stockId)
                cost += materialPrice * recipe.amount
            }
            item.cost = cost * item.amount

            chartsData.costData[new Date(item.updata_date).getMonth()] += cost * item.amount

            //利润
            chartsData.profitData[new Date(item.updata_date).getMonth()] = + item.amount * item.price - cost * item.amount

            //销售额排名客户
            if (clientRank[item.client]) {
                clientRank[item.client] += item.amount * item.price
            } else {
                clientRank[item.client] = item.amount * item.price
            }

            //类别占比
            if (categoriesPerCache[item.stock_id]) {
                //有缓存
                let index = categoriesPerCache[item.stock_id]
                categoriesPerTemp[index].sales.value += item.amount * item.price
                categoriesPerTemp[index].cost.value += cost * amount
                categoriesPerTemp[index].profit.value += item.amount * item.price - cost * item.amount

            } else {
                //无缓存
                let index = categoriesPerTemp.push(
                    {
                        sales: { name: `${item.name}/${item.type}`, value: item.amount * item.price },
                        cost: { name: `${item.name}/${item.type}`, value: cost * item.amount },
                        profit: { name: `${item.name}/${item.type}`, value: item.amount * item.price - cost * item.amount }
                    }
                ) - 1
                categoriesPerCache[item.stock_id] = index
            }
        }
    }


    //detail 格式化
    for (let item of sql_result) {
        //合并简写name_type
        item.name_type = `${item.name}/${item.type}`
        //销售额
        item.sales = item.amount * item.price
        //成本
        item.cost = item.cost
        //利润
        item.profit = item.amount * item.price - item.cost
    }

    //类别占比扁平化处理
    for (let item of categoriesPerTemp) {
        categoriesPer.totalSales += item.sales.value
        categoriesPer.totalCost += item.cost.value
        categoriesPer.totalProfit += item.profit.value
        categoriesPer.sales.push(item.sales)
        categoriesPer.cost.push(item.cost)
        categoriesPer.profit.push(item.profit)
    }

    //clientRank
    //扁平化处理
    let newClientRank = []
    for (let name in clientRank) {
        newClientRank.push({ name, value: clientRank[name] })
    }
    //冒泡排序
    for (let i = 0; i < newClientRank.length - 1; i++) {
        for (let j = 0; j < newClientRank.length - 1 - i; j++) {
            if (newClientRank[j].value > newClientRank[j + 1].value) {
                let temp = newClientRank[j + 1];
                newClientRank[j + 1] = newClientRank[j];
                newClientRank[j] = temp;
            }
        }
    }


    return res.json({ status: 200, msg: '获取成功', data: { categoriesPer, chartsData, clientRank: newClientRank.reverse().slice(0, 7), detail: { total, data: sql_result }, } })
}
