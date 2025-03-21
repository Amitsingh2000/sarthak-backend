const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/gallery'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// =================== ROUTES ===================

// Get all gallery images
router.get('/', galleryController.getAllImages);

// Upload a new image (expects image file + category)
router.post('/upload', upload.single('image'), galleryController.uploadImage);

// Delete a gallery image by ID
router.delete('/:id', galleryController.deleteImage);

module.exports = router;
