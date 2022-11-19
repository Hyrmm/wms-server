const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/store", require("./store"));


module.exports = router;