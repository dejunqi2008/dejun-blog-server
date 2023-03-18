const { ErrorModel } = require('../model/resModel');
const jwt = require('jsonwebtoken');

const loginCheck = (req, res, next) => {
    const { accessToken } = req.body;
    jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
        if (!!err) {
            return res.json(new ErrorModel('User is not logged in'))
        }
        const { iat, exp, username, realname } = decoded;
        if ((iat + exp) * 1000 < Date.now()) {
            return res.json(new ErrorModel('Token expired.'));
        }
        req.session.username = username;
        req.session.realname = realname;
        next();
    })
}

module.exports = loginCheck;