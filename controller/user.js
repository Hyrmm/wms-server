const { user } = require("../model")
const { res_data, jwt_config } = require("../config")
var jwt = require('jsonwebtoken');
const { json } = require("express");
exports.login = async (req, res, next) => {
    try {
        // 处理请求
        let req_data = req.body
        let sql_result = await user.login(req_data.account, req_data.passward)
        if (sql_result.length) {
            // 验证通过,生成token
            let token = jwt.sign({ user_id: sql_result[0].id, account: sql_result[0].account, nick: sql_result[0].nick, role: sql_result[0].role_name }, jwt_config.secretKey, { algorithm: jwt_config.algorithms[0] });
            return res.json(
                {
                    status: 200,
                    msg: "登陆成功",
                    data: {
                        user_id: sql_result[0].id,
                        account: sql_result[0].account,
                        nick: sql_result[0].nick,
                        role: sql_result[0].role_name,
                        updata_date: sql_result[0].updata_date,
                        iat: parseInt(Date.now() / 1000, 10),
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


//获取用户信息
exports.get_userInfo = async (req, res, next) => {
    //Token的payload部分若有所变动,根据数据库最新内容生成新的Token
    let payload = req.auth;
    let sql_result = await user.get_userInfo(payload.user_id)
    if (sql_result.length && (payload.user_id == sql_result[0].id) && (payload.account == sql_result[0].account) && (payload.nick == sql_result[0].nick) && (payload.role == sql_result[0].role_name)) {
        //用户信息并没有变更,直接返回当前token
        let token = req.headers.authorization
        return res.json({ status: 200, msg: "获取成功", data: { ...payload, token: token } })
    } else {
        //用户信息变动生成新的token,新的信息返回
        let token = jwt.sign({ user_id: sql_result[0].id, account: sql_result[0].account, nick: sql_result[0].nick, role: sql_result[0].role_name }, jwt_config.secretKey, { algorithm: jwt_config.algorithms[0] });
        return res.json({
            status: 200,
            msg: "获取成功",
            data: {
                user_id: sql_result[0].id,
                account: sql_result[0].account,
                nick: sql_result[0].nick,
                role: sql_result[0].role_name,
                updata_date: sql_result[0].updata_date,
                iat: parseInt(Date.now() / 1000, 10),
                token: token
            }
        })
    }
}

