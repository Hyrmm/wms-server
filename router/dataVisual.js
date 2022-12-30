/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-12-06 19:03:24
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2022-12-30 17:18:46
 * @FilePath: \wms-server\router\dataVisual.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const router = express.Router();

const { get_common_info, get_yearFiniishOrder, get_storeInfo, get_salesInfo,_get_yearFinishOrder } = require("../controller/dataVisual")


router.get("/getCommonInfo", get_common_info)

router.get("/getYearFinishOrder", _get_yearFinishOrder)
router.get("/getStoreInfo", get_storeInfo)
router.get("/getSalesInfo", get_salesInfo)
module.exports = router