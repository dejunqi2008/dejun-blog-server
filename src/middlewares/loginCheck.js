const { ErrorModel } = require('../model/resModel');

const loginCheck = (req, res, next) => {
    if (req.session.username) {
        console.log('already logined');
        return next();
    }
    res.json(new ErrorModel('Please login to see page contents.'));
}

module.exports = loginCheck;