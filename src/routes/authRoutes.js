const express = require('express');
const { authenticateFace } = require('../controllers/authController');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/', upload.single('selfie'), authenticateFace);

module.exports = router;
