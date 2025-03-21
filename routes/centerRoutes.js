const express = require('express');
const router = express.Router();
const centerDetailsController = require('../controllers/centerController');

router.get('/', centerDetailsController.getCenterDetails);
router.put('/', centerDetailsController.updateCenterDetails);

module.exports = router;
