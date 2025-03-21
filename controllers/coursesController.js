const fs = require('fs');
const path = require('path');

// Path to the courses.json file
const coursesFilePath = path.join(__dirname, '../data/courses.json');

// Helper function to read courses from the JSON file
const readCoursesFromFile = () => {
  try {
    const data = fs.readFileSync(coursesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading courses file:', err);
    return [];
  }
};

// Helper function to write courses to the JSON file
const writeCoursesToFile = (courses) => {
  try {
    fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('Error writing courses file:', err);
  }
};

// Get all courses
exports.getAllCourses = (req, res) => {
  const courses = readCoursesFromFile();
  res.json(courses);
};

// Add a new course
exports.addCourse = (req, res) => {
  const courses = readCoursesFromFile();
  const { title, description, duration, price, isPopular } = req.body;

  // Image handling
  const image = req.file ? req.file.filename : '';

  let newId = 1; // Default if no courses
  if (courses.length > 0) {
    const maxId = Math.max(...courses.map(course => course.id));
    newId = maxId + 1;
  }

  const newCourse = {
    id: newId,
    title,
    description,
    duration,
    price :parseInt(price),
    isPopular: isPopular === 'true' || false,
    image
  };
  console.log('Received price:', price);
  courses.push(newCourse);
  writeCoursesToFile(courses);

  res.status(201).json(newCourse);
};

// ✅ Update an existing course
exports.updateCourse = (req, res) => {
  const { id } = req.params;
  const { title, description, duration, price, isPopular } = req.body;
  const image = req.file ? req.file.filename : null; // optional image update

  let courses = readCoursesFromFile();

  const courseIndex = courses.findIndex(c => c.id == id);
  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Update fields
  courses[courseIndex].title = title;
  courses[courseIndex].description = description;
  courses[courseIndex].duration = duration;
  courses[courseIndex].price = parseInt(price);
  courses[courseIndex].isPopular = isPopular === 'true';
  console.log('Received price:', price);

  if (image) {
    courses[courseIndex].image = image; // only if new image provided
  }

  writeCoursesToFile(courses); // IMPORTANT: Save back to file

  res.json({ message: 'Course updated successfully!', course: courses[courseIndex] });
  
};

// Delete a course
exports.deleteCourse = (req, res) => {
  const { id } = req.params;
  let courses = readCoursesFromFile();
  const courseToDelete = courses.find(course => course.id === parseInt(id));

  if (!courseToDelete) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Remove course from array
  courses = courses.filter(course => course.id !== parseInt(id));

  // Write updated courses to file
  writeCoursesToFile(courses);

  // Delete image file
  const imagePath = path.join(__dirname, '../uploads', courseToDelete.image);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image:', err);
      // You can choose to proceed or notify error while deleting image
      return res.json({ message: 'Course deleted, but image could not be deleted' });
    }
    res.json({ message: 'Course and image deleted successfully!' });
  });
};