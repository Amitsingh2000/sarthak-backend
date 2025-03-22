const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudinary');

const coursesFilePath = path.join(__dirname, '../data/courses.json');

const readCoursesFromFile = () => {
  try {
    const data = fs.readFileSync(coursesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading courses file:', err);
    return [];
  }
};

const writeCoursesToFile = (courses) => {
  try {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('Error writing courses file:', err);
  }
};

exports.getAllCourses = (req, res) => {
  const courses = readCoursesFromFile();
  res.json(courses);
};

exports.addCourse = (req, res) => {
  try {
    const courses = readCoursesFromFile();
    const { title, description, duration, price, isPopular } = req.body;

    const imageUrl = req.file?.path || '';
    const publicId = req.file?.filename || '';

    if (!title || !description || !duration || !price || !imageUrl) {
      return res.status(400).json({ message: 'All fields are required including image' });
    }

    let newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;

    const newCourse = {
      id: newId,
      title,
      description,
      duration,
      price: parseInt(price),
      isPopular: isPopular === 'true' || false,
      imageUrl,
      publicId,
    };

    courses.push(newCourse);
    writeCoursesToFile(courses);

    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ message: 'Server error while adding course' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, price, isPopular } = req.body;

    let courses = readCoursesFromFile();
    const courseIndex = courses.findIndex(c => c.id == parseInt(id));

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.file) {
      // Delete old image from Cloudinary
      if (courses[courseIndex].publicId) {
        try {
          await cloudinary.uploader.destroy(courses[courseIndex].publicId);
        } catch (err) {
          console.error('Cloudinary deletion error:', err);
        }
      }
      courses[courseIndex].imageUrl = req.file.path;
      courses[courseIndex].publicId = req.file.filename;
    }

    courses[courseIndex].title = title;
    courses[courseIndex].description = description;
    courses[courseIndex].duration = duration;
    courses[courseIndex].price = parseInt(price);
    courses[courseIndex].isPopular = isPopular === 'true';

    writeCoursesToFile(courses);

    res.json({ message: 'Course updated successfully!', course: courses[courseIndex] });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(500).json({ message: 'Server error while updating course' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    let courses = readCoursesFromFile();
    const courseToDelete = courses.find(course => course.id === parseInt(id));

    if (!courseToDelete) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete image from Cloudinary
    if (courseToDelete.publicId) {
      try {
        await cloudinary.uploader.destroy(courseToDelete.publicId);
      } catch (err) {
        console.error('Cloudinary deletion error:', err);
      }
    }

    courses = courses.filter(course => course.id !== parseInt(id));
    writeCoursesToFile(courses);

    res.json({ message: 'Course and image deleted successfully!' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};
