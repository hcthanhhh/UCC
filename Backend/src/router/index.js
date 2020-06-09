const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Hello } = require('../controller/ApiController');
const { CloneProject, UploadProject, DeleteProject, UpdateProject } = require('../controller/SetupProjectApi');
const { UCCUrlMac, UCCUrlWindows, UCCUrlLinux, Compare } = require('../controller/UCCApi');
const { GetREADME, GetlistFile } = require('../controller/GetInfoApi');

const upload = multer({ dest: '../data' });

router.post('/CloneGit', CloneProject);
router.post('/DeleteGit', DeleteProject);
router.post('/UCCUrlWindows', UCCUrlWindows);
router.post('/UCCUrlMac', UCCUrlMac);
router.post('/UCCUrlLinux', UCCUrlLinux);
router.post('/UploadProject', upload.single('file'), UploadProject);
router.post('/GetInfo', GetREADME);
router.post('/Compare', Compare);
router.post('/GetlistFile', GetlistFile);
router.get('/Hello', Hello);
router.get('/UpdateProject', UpdateProject);

module.exports = router;