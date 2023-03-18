const express = require('express');
const router = express.Router();
const { createTag, getTags } = require('../controller/tag');

router.get('/', async (req, res, next) => {
    const { query } = req;
    console.log(query);
    const result = await getTags(query.blog_id);
    return res.json(result);
})

router.post('/new', async (req, res, next) => {
    // const noSpecialChars = str.replace(/[^a-zA-Z0-9 ]/g, '');
    const tagName = req.body.tagName;
    if (!tagName) return null;
    const result = await createTag(tagName);
    return res.json(result[0]);
})


module.exports = router;