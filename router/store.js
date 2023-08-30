const express = require("express");
const router = express.Router();

const { out_store_material, out_store_product, get_product_stockRecording, in_store_product, get_stock, get_material_stockRecording, get_storeOptions, get_transportStatusOptions, in_store_material, out_store, add_material_store, add_product_store, modify_out_store_status, edit_material_store, del_material_store, del_product_store, edit_product_store } = require("../controller/store")



router.get("/getStock", get_stock)
router.get("/getMaterialStockRecording", get_material_stockRecording)
router.get("/getProductStockRecording", get_product_stockRecording)

router.get("/getTransportStatusOptions", get_transportStatusOptions)
router.post("/getStoreOptions", get_storeOptions)

router.post("/inStoreMaterial", in_store_material)
router.post("/inStoreProduct", in_store_product)


router.post('/outStoreMaterial', out_store_material)
router.post('/outStoreProduct', out_store_product)



router.post('/addMaterialStore', add_material_store)
router.post('/addProductStore', add_product_store)
router.post('/modifyOutStoreStatus', modify_out_store_status)
router.post('/editMaterialStore', edit_material_store)
router.post('/delMaterialStore', del_material_store)

router.post('/editProductStore', edit_product_store)
router.post('/delProductStore', del_product_store)


module.exports = router