const express = require("express");
const router = express.Router();

const { get_common_info, get_storeInfo, get_salesInfo, _get_yearFinishOrder } = require("../controller/dataVisual")


router.get("/getCommonInfo", get_common_info)

router.get("/getStoreInfo", get_storeInfo)
router.get("/getSalesInfo", get_salesInfo)
module.exports = router