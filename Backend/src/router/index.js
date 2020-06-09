// Library
const express = require('express');
const router = express.Router();
const multer = require('multer');

// CONTROLLER
const { Hello } = require('../controller/ApiController');
const { CloneProject, UploadProject, DeleteProject, UpdateProject } = require('../controller/SetupProjectApi');
const { UCCUrlMac, UCCUrlWindows, UCCUrlLinux, CompareMac, CompareLinux } = require('../controller/UCCApi');
const { GetREADME, GetlistFile } = require('../controller/GetInfoApi');

const upload = multer({ dest: '../data' });

// Setup Project API
router.post('/CloneGit', CloneProject);
router.post('/UploadProject', upload.single('file'), UploadProject);
router.post('/DeleteGit', DeleteProject);
router.get('/UpdateProject', UpdateProject);

// UCC API
router.post('/UCCUrlWindows', UCCUrlWindows);
router.post('/UCCUrlMac', UCCUrlMac);
router.post('/UCCUrlLinux', UCCUrlLinux);
router.post('/CompareMac', CompareMac);
router.post('/Compare', CompareLinux);

// Get Info API
router.post('/GetInfo', GetREADME);
router.post('/GetlistFile', GetlistFile);

// TEST API
router.get('/Hello', Hello);

module.exports = router;