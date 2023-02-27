const express = require('express');
const router = express.Router();

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const redisClient = require('../db/redis');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const  loginCheck  = require('../middlewares/loginCheck');


router.get('/list', (req, res, next) => {

    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    console.log('get/list - req.session: ---- ', req.session);
    if (req.query.isadmin) {
        if (!req.session.username) {
            return res.json(new ErrorModel('You are not login yet.'));
        }
        author = req.session.username;
    }

    const result = getList(author, keyword);
    return result.then(listData => {
        res.json(new SuccessModel(listData));
    });
});

router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id);
    return result.then(data => {
        res.json(new SuccessModel(data));
    });
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then(data => res.json(new SuccessModel(data)));
})

module.exports = router;