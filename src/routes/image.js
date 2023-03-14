const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { s3MethodFactor } = require('../utils/s3');
const fs = require('fs');
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const { execSync } = require("child_process");


const express = require('express');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const router = express.Router();


router.post('/new', upload.single('image'), async (req, res, next) => {
    try {
        const result = await s3MethodFactor('uploadFile')(req.file);
        const { $metadata: { httpStatusCode }} = result;
        if (httpStatusCode === 200) {
            await unlinkFile(req.file.path);
            const { Key } = result;
            return res.json(new SuccessModel({imagePath: `/images/${Key}`}));
        } else {
            res.json(new ErrorModel());
        }
    } catch(err) {
        res.json(err);
    }
})

router.get('/:key', async (req, res, next) => {
    const key = req.params.key;
    const response = await s3MethodFactor('getFileStream')(key);
    response.Body.pipe(res);
})


module.exports = router;