const { user } = require("../model")
const { res_data, jwt_config } = require("../config")
var jwt = require('jsonwebtoken');
exports.login = async (req, res, next) => {
    try {
        // 处理请求
        let req_data = req.body
        let sql_result = await user.login(req_data.nick, req_data.passward)
        if (sql_result.length) {
            // 验证通过,生成token
            let token = jwt.sign({ nick: req_data.nick, role: sql_result[0].role_name }, jwt_config.secretKey, { algorithm: jwt_config.algorithms[0] });
            return res.json(
                {
                    status: 200,
                    msg: "登陆成功",
                    data: {
                        nick: sql_result[0].nick,
                        role: sql_result[0].role_name,
                        updata_date: sql_result[0].updata_date,
                        token: token
                    }
                }
            )
        }

        return res.json(res_data.login_fail);
    } catch (err) {
        next(err);
    }
};
exports.register = async (req, res, next) => {
    try {
        // 处理请求
        res.send("post /user/login");
    } catch (err) {
        next(err);
    }
};