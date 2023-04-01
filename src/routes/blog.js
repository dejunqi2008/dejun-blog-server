const express = require('express');
const router = express.Router();

const {
    getList,
    getListV2,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getTotalBlogNumber,
    getTotalBlogNumberWithTag,
    LIMIT
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const  loginCheck  = require('../middlewares/loginCheck');


router.get('/list', async (req, res, next) => {
    let author = req.query.author || '';
    const tagname = req.query.tagname || '';
    const page = parseInt(req.query.page || '1')
    const listData = await getList(author, page, tagname);
    let totalRecords = await getTotalBlogNumberWithTag(tagname);
    const numOfPages = Math.ceil((totalRecords / LIMIT));
    res.json(new SuccessModel(listData, {totalRecords, numOfPages}));
});

router.get(`/listv2`, async (req, res, next) => {
    let author = req.query.author || '';
    const keyword = req.query.keyword || '';
    const page = parseInt((req.query.page || '1'));
    let resp = await getListV2(page, author, keyword)
    let totalRecords = await getTotalBlogNumber(author, keyword);
    const numOfPages = Math.ceil((totalRecords / LIMIT));
    res.json(new SuccessModel(resp, {totalRecords, numOfPages}))
})

router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id);
    return result.then(data => {
        res.json(new SuccessModel(data));
    });
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username;
    console.log(req.body);
    const result = newBlog(req.body);
    return result.then(data => res.json(new SuccessModel(data)));
})

router.post('/update', loginCheck, (req, res, next) => {
    const resp = updateBlog(req.query.id, req.body);
    return resp.then(val => {
        return !!val ? res.json(new SuccessModel({id: req.query.id})) : res.json(new ErrorModel('Error'));
    })
});

router.post('/delete', loginCheck, (req, res, next) => {
    const resp = delBlog(req.query.id, req.session.username);
    return resp.then(val => {
        return !!val ? res.json(new SuccessModel()) : res.json(new ErrorModel('Error'));
    });
});


module.exports = router;