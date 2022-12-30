const express = require("express");
const router = express.Router();


const { get_client, get_client_options, modify_client, add_client, del_client } = require("../controller/client");

router.get("/getClient", get_client)
router.get("/getClientOptions", get_client_options)
router.post("/addClient", add_client)
router.post("/modifyClient", modify_client)
router.post("/delClient", del_client)

module.exports = router