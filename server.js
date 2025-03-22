const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const courseRoutes = require('./routes/courses');
const enquiryRoutes = require('./routes/enquiries');
const adminRoutes = require('./routes/adminRoutes');
const centerRoutes = require('./routes/centerRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://sarthak-computers.netlify.app', // Replace with your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/center-details', centerRoutes);
app.use('/api/gallery', galleryRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Computer Training Center API is running.');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
