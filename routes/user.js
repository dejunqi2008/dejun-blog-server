const express = require('express');
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const router = express.Router();

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    const result = login(username, password);
    
    return result.then(data => {
        if (data.username) {
            req.session.username = data.username;
            req.session.realname = data.realname;
            return res.json(new SuccessModel());
        }
        res.json(new ErrorModel('Login failed'));
    });
});

module.exports = router;