const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { s3MethodFactory } = require('../utils/s3');
const fs = require('fs');
const util = require('util')
const unlinkFile = util.promisify(fs.unlinkSync);
const express = require('express');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { addImgaes, getImages } = require('../controller/image');
const loginCheck = require('../middlewares/loginCheck');
const router = express.Router();


router.post('/profile/new', loginCheck, upload.single('image'), async (req, res, next) => {

    const { username } = req.body;
    let resp;

    try {
        const result = await s3MethodFactory('uploadFile')(req.file, username);
        const { $metadata: { httpStatusCode }} = result;
        if (httpStatusCode === 200) {
            const { Key } = result;
            resp = new SuccessModel({imagePath: `/images/${Key}`});
        } else {
            resp = new ErrorModel("Unknow error");
        }
    } catch(err) {
        console.log(err);
        resp = new ErrorModel(err.message);
    }

    fs.access(req.file.path, (err) => {
        if (!err) {
            unlinkFile(req.file.path);
        }
    })

    return res.json(resp);
});

router.post('/userphotos/new', loginCheck, upload.array('photos', 10), async (req, res, next) => {
    const { username, album_id } = req.body;
    let resp;
    try {
        const promises = req.files.map(file => s3MethodFactory('uploadFile')(file, username));
        const results = await Promise.all(promises);
        const paths = results.map(item => {
            const { $metadata: { httpStatusCode }} = item;
            if (httpStatusCode === 200) {
                return `/images/${item.Key}`;
            }
        });
        const result = await addImgaes(paths, username, album_id);
        if (result.affectedRows === paths.length) {
            resp = new SuccessModel({imagePaths: paths});
        } else {
            resp = new ErrorModel("Unknow Error, some of your photos was not able to put into our database");
        }
    } catch (err) {
        resp = new ErrorModel(err);
    }

    req.files.forEach(file => {
        fs.access(file.path, (err) => {
            if (!err) {
                unlinkFile(file.path);
            }
        })
    });
    return res.json(resp);
});

router.get('/userphotos', async (req, res, next) => {
    const {query} = req;
    let resp
    try {
        const result = await getImages(query.username, query.albumid);
        resp = new SuccessModel(result.map(e => e.image_path));
    } catch (err) {
        resp = new ErrorModel(err);
    }

    return res.json(resp);
})

router.get('/:key', async (req, res, next) => {
    const key = req.params.key;
    let response;
    try {
        response = await s3MethodFactory('getFileStream')(key);
        response.Body.pipe(res);
    } catch (err) {
        return res.boom.notFound(err.message || "No such file or Access denied");
    }  
})

router.get('/:username/:key', async (req, res, next) => {
    const {username, key} = req.params;
    try {
        const resp = await s3MethodFactory('getFileStream')(`${username}/${key}`);
        return resp.Body.pipe(res);
    } catch (err) {
        return res.boom.notFound(err.message || "No such file or Access denied");
    }
})


module.exports = router;