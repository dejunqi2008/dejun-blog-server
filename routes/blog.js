const express = require('express');
const router = express.Router();

/* GET post */

router.get('/list', (req, res, next) => {
    res.json({
        errno: 0,
        data: [1, 2, 3]
    })
});

router.get('/detail', (req, res, next) => {
    res.json({
        errno: 0,
        data: 'ok'
    });
})

module.exports = router;