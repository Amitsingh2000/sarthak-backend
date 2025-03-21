const fs = require('fs');
const path = require('path');

const enquiriesFile = path.join(__dirname, '../data/enquiries.json');

// Get all enquiries
exports.getEnquiries = (req, res) => {
  fs.readFile(enquiriesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading enquiries data.' });
    const enquiries = JSON.parse(data);
    res.json(enquiries);
  });
};

// Add new enquiry
exports.addEnquiry = (req, res) => {
  const { name, email, mobile, courseInterested, message } = req.body;

  fs.readFile(enquiriesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading enquiries data.' });

    const enquiries = JSON.parse(data);

    // Get next ID (increment last id or start from 1)
    let nextId = 1;
    if (enquiries.length > 0) {
      const lastEnquiry = enquiries[enquiries.length - 1];
      nextId = lastEnquiry.id + 1;
    }

    const newEnquiry = {
      id: nextId,
      name,
      email,
      mobile,
      courseInterested,
      message,
      resolved: false, // Default status
      createdAt: new Date().toISOString(), // Timestamp
    };

    enquiries.push(newEnquiry);

    fs.writeFile(enquiriesFile, JSON.stringify(enquiries, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error saving enquiry.' });
      res.status(201).json({ message: 'Enquiry submitted successfully!' });
    });
  });
};

exports.resolveEnquiry = (req, res) => {
  const enquiryId = parseInt(req.params.id);

  fs.readFile(enquiriesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading enquiries data.' });

    let enquiries = JSON.parse(data);
    const index = enquiries.findIndex(e => e.id === enquiryId);

    if (index === -1) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    enquiries[index].resolved = true;

    fs.writeFile(enquiriesFile, JSON.stringify(enquiries, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error updating enquiry.' });
      res.json({ message: 'Enquiry marked as resolved.' });
    });
  });
};

// ✅ Delete Enquiry
exports.deleteEnquiry = (req, res) => {
  const enquiryId = parseInt(req.params.id);

  fs.readFile(enquiriesFile, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading enquiries data.' });

    let enquiries = JSON.parse(data);
    const filtered = enquiries.filter(e => e.id !== enquiryId);

    if (filtered.length === enquiries.length) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }

    fs.writeFile(enquiriesFile, JSON.stringify(filtered, null, 2), (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting enquiry.' });
      res.json({ message: 'Enquiry deleted successfully.' });
    });
  });
};

