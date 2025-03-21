const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // <-- Important to serve uploads folder

const courseRoutes = require('./routes/courses');
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/adminRoutes');
const centerRoutes = require('./routes/centerRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/center-details',centerRoutes);
app.use('/api/gallery', galleryRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
