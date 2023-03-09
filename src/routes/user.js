const express = require('express');
const { login, cookieMaxAge } = require('../controller/user');
const loginCheck = require('../middlewares/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const router = express.Router();

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { generateAccessToken } = require('../utils/cryp');

router.post('/login', (req, res, next) => {

    const { username, password } = req.body;
    const result = login(username, password);

    
    return result.then(data => {
        if (data.username) {
            const {username, realname} = data;
            req.session.username = username;
            req.session.realname = realname;
            const jsonwebtoken = generateAccessToken(username, realname);
            return res.json(new SuccessModel({
                ...req.session,
                accessToken: jsonwebtoken
            }));
        }
        return res.json(new ErrorModel('Login failed'));
    });
});

router.post('/loggedIn', loginCheck, (req, res, next) => {
    const { username, realname } = req.session;
    return res.json(new SuccessModel({
        username, realname, isLoggedInUser: true
    }));
});

module.exports = router;