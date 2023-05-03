

const express = require('express');
const router = express.Router();
const { createAlbum, getAlbums } = require('../controller/album');
const { loginCheck } = require('../middlewares/loginCheck');

router.post('/new', loginCheck, async (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description || '';
    const owner_id = req.body.owner_id;
    const result = await createAlbum(name, description, owner_id);
    if (result.error) {
        res.status(400);
    }
    return res.json(result);
});

router.get("/", async (req, res, next) => {
    const { query } = req;
    if (!query.username) {
        res.status(404);
        return res.json({});
    }
    const result = await getAlbums(query.username);
    return res.json(result);
})

module.exports = router;