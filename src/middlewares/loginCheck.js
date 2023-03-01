const { ErrorModel } = require('../model/resModel');

const loginCheck = (req, res, next) => {
    console.log('login check req.session', req.session)
    if (req.session.username) {
        console.log('already logined');
        return next();
    }
    res.json(new ErrorModel('Please login to see page contents.'));
}

module.exports = loginCheck;