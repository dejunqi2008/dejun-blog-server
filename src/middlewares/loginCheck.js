const { ErrorModel } = require('../model/resModel');
const jwt = require('jsonwebtoken');

const loginCheck = (req, res, next) => {
    // console.log(req.accessToken);
    console.log(req.body);
    const { accessToken } = req.body;
    console.log(accessToken);
    jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
        if (!!err) {
            console.log(err);
            return res.json(new ErrorModel('User is not logged in'))
        }
        const { iat, exp, username, realname } = decoded;
        if ((iat + exp) * 1000 < Date.now()) {
            return res.json(new ErrorModel('Token expired.'));
        }
        req.session.username = username;
        req.session.realname = realname;
        next();
    });
}

const loginCheckSync = (req) => {
    try {
        const decoded = jwt.verify(req.body.accessToken, process.env.JWT_TOKEN_SECRET);
        const { iat, exp, username, realname } = decoded;
        if ((iat + exp) * 1000 < Date.now()) {
            throw new ErrorModel('Token expired.');
        }
        req.session.username = username;
        req.session.realname = realname;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {
    loginCheck,
    loginCheckSync
};