const express = require("express");
const router = express.Router();

const { get_stock, get_stockRecording, get_storeOptions, get_transportStatusOptions, in_store, out_store, add_store } = require("../controller/store")



router.get("/getStock", get_stock)
router.get("/getStockRecording", get_stockRecording)
router.get("/getStoreOptions", get_storeOptions)
router.get("/getTransportStatusOptions", get_transportStatusOptions)
router.post("/inStore", in_store)
router.post('/outStore', out_store)
router.post('/addStore', add_store)

module.exports = router