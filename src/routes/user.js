const express = require('express');
const { login, getUser, updateUser, signup } = require('../controller/user');
const loginCheck = require('../middlewares/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const router = express.Router();

const { generateAccessToken } = require('../utils/cryp');

router.get('/', (req, res, next) => {
    const username = req.query.username;
    if (!username) return res.json(new ErrorModel("Username is not provided in query string"));

    const result = getUser(username);
    return result.then(data => res.json(new SuccessModel(data)));
})

router.post('/update', loginCheck, async (req, res, next) => {
    const result = updateUser(req.body);
    const data = await result;
    return res.json(new SuccessModel(data));
    
})

router.post('/new', async (req, res, next) => {
    console.log(req.body);
    const data = await signup(req.body);
    const {success, message} = data;
    return success ? res.json(new SuccessModel()) : res.json(new ErrorModel(message));
})


router.post('/login', async (req, res, next) => {

    const { username, password } = req.body;
    const result = login(username, password);
    const data = await result;
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

router.post('/loggedIn', loginCheck, (req, res, next) => {
    const { username, realname } = req.session;
    return res.json(new SuccessModel({
        username, realname, isLoggedInUser: true
    }));
});

module.exports = router;