const express = require("express");
const router = express.Router();
const { login, register, get_userInfo } = require("../controller/user")




router.post("/login", login)
router.post("/register", register)
router.get("/getUserInfo", get_userInfo)

module.exports = router