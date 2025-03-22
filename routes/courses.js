const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const { upload } = require('../cloudinary');

// Get all courses
router.get('/', coursesController.getAllCourses);

// Add new course with image upload
router.post('/', upload.single('image'), coursesController.addCourse);

// Update existing course, optionally with new image upload
router.put('/:id', upload.single('image'), coursesController.updateCourse);

// Delete course and its image
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
