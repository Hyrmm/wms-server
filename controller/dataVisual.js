/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-12-06 19:02:13
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2023-01-22 00:19:36
 * @FilePath: \wms-server\controller\dataVisual.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%
 */
const { dataVisual } = require("../model")
const { get_stockRecording } = require("../model/store")
const { res_data } = require("../config")



exports.get_common_info = async (req, res) => {
    //获取总库存
    let stocks_sql_result = await dataVisual.get_total_stock()
    let total_stocks = stocks_sql_result[0].total
    //获取总客户
    let client_sql_result = await dataVisual.get_total_client()
    let total_client = client_sql_result[0].total
    //获取出库总记录
    let outOrder_sql_result = await dataVisual.get_total_outOrder()
    let total_outOrder = outOrder_sql_result[0].total
    //获取入库总记录
    let inOrder_sql_result = await dataVisual.get_total_inOrder()
    let total_inOrder = inOrder_sql_result[0].total
    //获取不同状态订单总数量
    //  未出货
    let order_unSend = (await dataVisual.get_order_count(1))[0].total
    //  已出货
    let order_sended = (await dataVisual.get_order_count(2))[0].total
    //  已收货
    let order_received = (await dataVisual.get_order_count(3))[0].total
    //  退回仓库
    let order_backStore = (await dataVisual.get_order_count(4))[0].total
    //  退回原厂
    let order_backOri = (await dataVisual.get_order_count(5))[0].total
    return res.json({
        status: 200, msg: "获取成功", data: {
            total_stocks,
            total_client,
            total_outOrder,
            total_inOrder,
            order_unSend,
            order_sended,
            order_received,
            order_backStore,
            order_backOri
        }
    })
}

exports.get_yearFiniishOrder = async (req, res) => {
    let year = req.query.year || ""
    let month = req.query.month || ""
    //字段验证
    if (!year) return res.json(res_data.query_fail)
    //获取指定一年每月实际完成订单 1.已收货, 退回仓库4, 退回原厂5
    let yearFinishOrder = { received: [], backOri: [], backStore: [] }
    let statusMap = new Map()
    statusMap.set(yearFinishOrder.received, 1)
    statusMap.set(yearFinishOrder.backOri, 4)
    statusMap.set(yearFinishOrder.backStore, 5)

    //验证获取的是年还是月
    for (let key in yearFinishOrder) {
        let cur_orderStatus = statusMap.get(yearFinishOrder[key])
        if (month) {
            //具体到日
            for (let i = 0; i < 31; i++) {
                let temp = (await dataVisual.get_order(cur_orderStatus, `${year}-${month}-${i + 1}`, `${year}-${month}-${i + 2}`))[0].total
                yearFinishOrder[key].push(temp)
            }
        } else {
            //具体到月
            for (let i = 0; i < 12; i++) {
                let temp = (await dataVisual.get_order(cur_orderStatus, `${year}-${i + 1}-1`, `${year}-${i + 1}-31`))[0].total
                yearFinishOrder[key].push(temp)
            }
        }
    }
    //横坐标消息
    let xData = []
    if (month) {
        for (let i = 0; i < 31; i++) {
            xData.push(`${i + 1}`)
        }

    } else {
        xData = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    }
    return res.json({ status: 200, msg: "获取成功", data: Object.assign({ year, month, xData }, yearFinishOrder) })
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
    let sql_result = await get_stockRecording("out_order", "finish_date", "ASC", "", "", "", filter_date_start, filter_date_end, 3, "", "", false, true)
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
            chartsData.costData[new Date(item.finish_date).getDate() - 1] += item.another_fee

            //利润
            chartsData.profitData[new Date(item.finish_date).getDate() - 1] = + item.amount * item.price - item.another_fee

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
                categoriesPerTemp[index].cost.value += item.another_fee
                categoriesPerTemp[index].profit.value += item.amount * item.price - item.another_fee

            } else {
                //无缓存
                let index = categoriesPerTemp.push(
                    {
                        sales: { name: `${item.name}/${item.type}`, value: item.amount * item.price },
                        cost: { name: `${item.name}/${item.type}`, value: item.another_fee },
                        profit: { name: `${item.name}/${item.type}`, value: item.amount * item.price - item.another_fee }
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
            chartsData.salesData[new Date(item.finish_date).getMonth()] += item.amount * item.price

            //成本
            chartsData.costData[new Date(item.finish_date).getMonth()] += item.another_fee

            //利润
            chartsData.profitData[new Date(item.finish_date).getMonth()] = + item.amount * item.price - item.another_fee

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
                categoriesPerTemp[index].cost.value += item.another_fee
                categoriesPerTemp[index].profit.value += item.amount * item.price - item.another_fee

            } else {
                //无缓存
                let index = categoriesPerTemp.push(
                    {
                        sales: { name: `${item.name}/${item.type}`, value: item.amount * item.price },
                        cost: { name: `${item.name}/${item.type}`, value: item.another_fee },
                        profit: { name: `${item.name}/${item.type}`, value: item.amount * item.price - item.another_fee }
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
        item.cost = item.another_fee
        //利润
        item.profit = item.amount * item.price - item.another_fee
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
exports._get_yearFinishOrder = async (req, res) => {
    let xData, year = req.query.year, month = req.query.month, received, backOri, backStore
    //字段验证
    if (!year) {
        return res.json(res_data.query_fail)
    }

    xData = month ? Array.from(new Array(31), (element, index) => index + 1) : ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月",]
    received = Array.from(new Array(month ? 31 : 12), element => 0)
    backOri = Array.from(new Array(month ? 31 : 12), element => 0)
    backStore = Array.from(new Array(month ? 31 : 12), element => 0)
    filter_date_start = `${year}-${month ? month : 1}-1`
    filter_date_end = `${year}-${month ? month : 12}-31`
    let sql_result = await dataVisual.get_order(filter_date_start, filter_date_end)
    for (let item of sql_result) {

        switch (item.transport_status) {
            //status 1:未收货 2:已发货 3:已收货 4:退回仓库 5:退回原厂
            case "3":
                received[month ? new Date(item.updata_date).getDate() - 1 : new Date(item.updata_date).getMonth()] += 1
                break
            case "4":
                backStore[month ? new Date(item.updata_date).getDate() - 1 : new Date(item.updata_date).getMonth()] += 1
                break
            case "5":
                backOri[month ? new Date(item.updata_date).getDate() - 1 : new Date(item.updata_date).getMonth()] += 1
                break
        }
    }


    return res.json({ status: 200, msg: "获取成功", data: { sql_result, year, month, xData, received, backOri, backStore } })




}