// Library
const express = require('express');
const router = express.Router();
const multer = require('multer');

// CONTROLLER
const { Hello } = require('../controller/ApiController');
const { CloneProject, UploadProject, DeleteProject, UpdateProject } = require('../controller/SetupProjectApi');
const { UCCUrlMac, UCCUrlWindows, UCCUrlLinux, CompareMac, CompareLinux } = require('../controller/UCCApi');
const { GetREADME, GetlistFile, GetResultUCC, GetSLOCandType, GetSLOC, getUserSize, getProjectSize, Cyclomatic, RatioCyclomatic, CyclomaticFormatted } = require('../controller/GetInfoApi');
const { CalculateUCP } = require('../controller/UCPApi');
const { CalculateFP } = require('../controller/FPApi')
const { BasicCocomo, IntermediateCocomo, DetailedCocomo } = require('../controller/CocomoApi');

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
router.post('/GetResultUCC', GetResultUCC);
router.post('/GetSLOCandType', GetSLOCandType);
router.post('/GetSLOC', GetSLOC);
router.post('/GetUserSize', getUserSize);
router.post('/GetProjectSize', getProjectSize);
router.post('/GetCyclomatic', CyclomaticFormatted);
router.post('/GetRatioCyclomatic', RatioCyclomatic);
router.post('/GetCyclomaticFormatted', Cyclomatic);

// UCP API
router.post('/CalculateUCP', CalculateUCP);

// FP API
router.post('/CalculateFP', CalculateFP);

// Cocomo API
router.post('/BasicCocomo', BasicCocomo);
router.post('/IntermediateCocomo', IntermediateCocomo);
router.post('/DetailedCocomo', DetailedCocomo);

// TEST API
router.get('/Hello', Hello);

module.exports = router;