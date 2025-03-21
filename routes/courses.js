const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController'); // ✅ Correct
const upload = require('../middleware/multerConfig');

// Get all courses
router.get('/', coursesController.getAllCourses);

// Add a new course with image upload
router.post('/', upload.single('image'), coursesController.addCourse);

// Update an existing course
router.put('/:id', upload.single('image'), coursesController.updateCourse); 

// Delete a course
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
