/*
 * @Author: Hyrm 1358188945@qq.com
 * @Date: 2022-11-02 15:40:50
 * @LastEditors: Hyrm 1358188945@qq.com
 * @LastEditTime: 2023-01-01 14:30:07
 * @FilePath: \wms-server\router\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const router = express.Router();
router.use("/user", require("./user"));
router.use("/store", require("./store"));
router.use("/client", require("./client"));
router.use("/dataVisual", require("./dataVisual"));
module.exports = router;