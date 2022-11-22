const express = require("express");
const router = express.Router();

const { get_stock, get_stockRecording, get_storeOptions } = require("../controller/store")



router.get("/getStock", get_stock)
router.get("/getStockRecording", get_stockRecording)
router.get("/getStoreOptions", get_storeOptions)


module.exports = router