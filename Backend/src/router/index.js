const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    CloneGit,
    UCCUrlMac,
    UCCUrlWindows,
    UCCUrlLinux,
    UpdateGit,
    DeleteGit,
    UploadProject,
    GetInfo,
    Compare,
    GetlistFile,
    Hello
} = require('../controller/ApiController');

const upload = multer({ dest: '../data' });

router.post('/CloneGit', CloneGit);
router.post('/DeleteGit', DeleteGit);
router.post('/UCCUrlWindows', UCCUrlWindows);
router.post('/UCCUrlMac', UCCUrlMac);
router.post('/UCCUrlLinux', UCCUrlLinux);
router.post('/UploadProject', upload.single('file'), UploadProject);
router.post('/GetInfo', GetInfo);
router.post('/Compare', Compare);
router.post('/GetlistFile', GetlistFile);
router.get('/Hello', Hello);

module.exports = router;