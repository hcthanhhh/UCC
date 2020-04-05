const express = require('express');
const router = express.Router();
const {CloneGit, UCC2Url, UCCaUrl, UpdateGit, DeleteGit} = require('../controller/ApiController')

router.post('/CloneGit', CloneGit)
router.post('/UpdateGit', UpdateGit)
router.post('/DeleteGit', DeleteGit)
router.post('/UCCaUrl', UCCaUrl)
router.post('/UCC2Url', UCC2Url)

module.exports = router;