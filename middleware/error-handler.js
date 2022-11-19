const { res_data } = require("../config")
module.exports = () => {
    return (err, req, res, next) => {
        if (err.name === "UnauthorizedError") return res.status(200).json(res_data.auth_fail)
        console.log(err)
        res.status(500).json({
            error: err
        });
    };
};