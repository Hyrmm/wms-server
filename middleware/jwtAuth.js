const { expressjwt } = require("express-jwt");
// jwt密钥
const { jwt_config } = require("../config")

const jwtAuth = expressjwt({
    secret: jwt_config.secretKey,
    algorithms: jwt_config.algorithms,
    getToken: (req) => {
        return req.headers.authorization
    }
}).unless({ path: ["/api/user/login", "/api/user/register"] });

module.exports = jwtAuth;










