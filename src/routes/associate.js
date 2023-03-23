const express = require('express');
const router = express.Router();
const {associate, getAssociations } = require('../controller/associate')


// associate a blog with a tag
router.post('/new', async (req, res, next) => {
    const {blogId, tagIds} = req.body;

    // console.log(req.body, !blogId, !tagIds, tagIds.length === 0);
    
    if (!blogId || !tagIds || tagIds.length === 0) return null;
    const result = await associate(blogId, tagIds);
    return res.json(result);
});


module.exports = router;