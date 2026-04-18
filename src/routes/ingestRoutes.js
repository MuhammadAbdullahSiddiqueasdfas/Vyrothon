const express = require('express');
const { ingestImages } = require('../controllers/ingestController');
const router = express.Router();

router.post('/', ingestImages);

module.exports = router;
