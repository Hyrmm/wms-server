const { expressjwt } = require("express-jwt");
// jwt密钥
const { jwt_config } = require("../config")
const { get_revoked_token } = require('../model/user')


//Token是否失效
const isRevokedCallback = async (req, token) => {
    const signature = token.signature
    let sql_result = await get_revoked_token(signature)
    return Boolean(sql_result.length);
}


const jwtAuth = expressjwt({
    secret: jwt_config.secretKey,
    algorithms: jwt_config.algorithms,
    getToken: (req) => {
        return req.headers.authorization
    },
    isRevoked: isRevokedCallback,
}).unless({ path: ["/api/user/login", "/api/user/register"] });

module.exports = jwtAuth;










