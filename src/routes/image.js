const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { uploadFile } = require('../utils/s3');


const express = require('express');
const { SuccessModel } = require('../model/resModel');
const router = express.Router();

// this api upload a image to server
router.put('/add', upload.single('image'), (req, res, next) => {
    if (!!req.file) {
        return res.json(new SuccessModel({
            message: 'Successully put the image to remote server, waiting to be upload.'
        }))
    } else {
        return res.json(new Error("Failed to deliver the image to the server."))
    }
})

router.post('/new', async (req, res, next) => {
    console.log(req.file);
    try {
        const result = await uploadFile(req.file);
        console.log('upload call result', result);
        return res.json(new SuccessModel(result));
    } catch(err) {
        console.log(err)
        res.json(err);
    }
    
})


module.exports = router;