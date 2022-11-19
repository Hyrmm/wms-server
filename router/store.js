const express = require("express");
const router = express.Router();

const { get_stock, get_stockRecording } = require("../controller/store")




router.get("/getStock", get_stock)
router.get("/getStockRecording", get_stockRecording)


module.exports = router