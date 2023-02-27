const express = require('express');
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog');
const redisClient = require('../db/redis');

const { SuccessModel, ErrorModel } = require('../model/resModel');

const router = express.Router();

/* GET post */

router.get('/list', (req, res, next) => {

    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    console.log('get/list - req.session: ---- ', req.session);
    if (req.query.isadmin) {
        if (!req.session.username) {
            console.log('blog/list -- req.session ', req.session);
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
    res.json({
        errno: 0,
        data: 'ok'
    });
})

module.exports = router;