const express = require("express");
const router = express.Router();
router.use("/user", require("./user"));
router.use("/store", require("./store"));
router.use("/client", require("./client"));
router.use("/dataVisual", require("./dataVisual"));
module.exports = router;