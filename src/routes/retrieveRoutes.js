const express = require('express');
const { getImagesByGrabId } = require('../controllers/retrieveController');
const router = express.Router();

router.get('/:grab_id', getImagesByGrabId);

module.exports = router;
