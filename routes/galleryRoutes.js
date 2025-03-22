const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { upload } = require('../cloudinary');

// Get all gallery images
router.get('/', galleryController.getAllImages);

// Upload a new gallery image
router.post('/', upload.single('image'), galleryController.uploadImage);

// Delete a gallery image
router.delete('/:id', galleryController.deleteImage);

module.exports = router;
