//数据库挂载
const sql = require("./model")




const express = require("express")
const app = express()

// 中间件:解析请求体 日志输出 跨域请求
const morgan = require("morgan");
const cors = require('cors')
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan("dev"));
app.use(cors());

const jwtAuth = require("./middleware/jwtAuth")

// gzip压缩
var compression = require('compression');
app.use(compression());
//静态文件挂载
app.use(express.static('./static'))

//jwt认证中间件
app.use("/api", jwtAuth);

// 挂载路由
const router = require("./router");
app.use("/api", router)



// 统一错误处理中间件
const errorHandler = require("./middleware/error-handler");
app.use(errorHandler());

// 统一404处理中间件
const notFound = require("./middleware/404-handler");
app.use(notFound());





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});