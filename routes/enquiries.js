const express = require('express');
const router = express.Router();
const { getEnquiries, addEnquiry,resolveEnquiry,deleteEnquiry } = require('../controllers/enquiriesController');

router.get('/', getEnquiries);
router.post('/', addEnquiry);
router.put('/:id/resolve', resolveEnquiry);
router.delete('/:id', deleteEnquiry);

module.exports = router;
