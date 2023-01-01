<p align="center">
    <a href="https://github.com/Hyrmm/wms-server" target="_blank" style="margin-right: 20px; font-style: normal; text-decoration: none;">
        <img src="https://img.shields.io/github/stars/Hyrmm/wms-server" alt="Github Stars" />
    </a>
    <a href="https://github.com/Hyrmm/wms-server" target="_blank" style="margin-right: 20px; font-style: normal; text-decoration: none;">
        <img src="https://img.shields.io/github/forks/Hyrmm/wms-server" alt="Github Forks" />
    </a>
    <a href="https://github.com/Hyrmm/wms-server" target="_blank" style="margin-right: 20px; font-style: normal; text-decoration: none;">
        <img src="https://img.shields.io/github/languages/code-size/Hyrmm/wms-server" alt="Code-size" />
    </a>
<p />


## :triangular_flag_on_post:前言

此项目是配合`wms-client`前端项目所开发的项目，此后端项目使用的是`Node`、`Express`、`Mysql`，没有什么复杂的架构，只是快速生成接口。

## :door:传送门

- 配合的`wms-client`前端项目::link:[使劲点我](https://github.com/Hyrmm/wms-client) 
- 接口文档::link:[使劲点我](https://www.apifox.cn/apidoc/shared-cc2e15b2-0ea5-4e16-91e9-6b113015a758/api-51164289)

## :rocket:运行项目

:one:拉取项目文件

git clone https://github.com/Hyrmm/wms-server

:two:切换到项目目录

cd wms-server

:three:安装依赖包

npm install

:four:配置数据库

- 自行搭建好`Mysql`数据库服务,我使用的是`Mysql5.6`

- 编辑相关配置文件,位于项目位置:`/config/index.js`

```js
//jwt配置
jwt_config: {
    // jwt密钥
	secretKey: '...',
    //加密模式，默认可不修改
	algorithms: ["HS256"]
},
//数据库配置
dataBaseConfig: {
	host: '数据库地址',
	port: "端口",
	user: '用户名',
	password: '密码',
	database: '数据库名称'
},
```

- 为数据库生成数据，项目提供了结构和数据`wms.sql`、仅的结构`wms_nodata.sql`文件，可以为你快速生成所需表的结构和数据。(关于sql文件如何导入数据库，可自行百度)

- 所有接口路径都是以`/api`开头,想要自定义内容，可配置相关文件，位于项目目录:`/app.js` `/router/index.js`

```js
// app.js
const router = require("./router");
app.use("/api", router)
```

```js
// router/index.js
const express = require("express");
const router = express.Router();
router.use("/user", require("./user"));
router.use("/store", require("./store"));
router.use("/client", require("./client"));
router.use("/dataVisual", require("./dataVisual"));
module.exports = router;
```

> 此项目配合wms-client项目，都会进行长期维护。如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍。

