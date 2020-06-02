const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    CloneGit, 
    UCC2Url, 
    UCCaUrl, 
    UpdateGit, 
    DeleteGit, 
    UploadProject,
    GetInfo,
    Compare,
    Hello
} = require('../controller/ApiController');

const upload = multer({dest: '../data'});

router.post('/CloneGit', CloneGit);
router.post('/DeleteGit', DeleteGit);
router.post('/UCCaUrl', UCCaUrl);
router.post('/UCC2Url', UCC2Url);
router.post('/UploadProject',upload.single('file'), UploadProject);
router.post('/GetInfo', GetInfo)
router.post('/Compare', Compare);
router.get('/Hello', Hello);

module.exports = router;