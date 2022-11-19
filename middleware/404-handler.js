

const { res_data } = require("../config")
module.exports = () => {
    return (req, res, next) => {
        res.status(200).json(res_data.route_fail);
    };
};