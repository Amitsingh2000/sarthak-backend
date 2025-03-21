const fs = require('fs');
const path = require('path');

// Path to JSON file
const centerDetailsPath = path.join(__dirname, '../data/centerDetails.json');

// Read existing data
const readCenterDetails = () => {
  const data = fs.readFileSync(centerDetailsPath);
  return JSON.parse(data);
};

// Write updated data
const writeCenterDetails = (details) => {
  fs.writeFileSync(centerDetailsPath, JSON.stringify(details, null, 2));
};

// Update Controller
exports.updateCenterDetails = (req, res) => {
  const { name, description, location, contact, email } = req.body;

  if (!name || !description || !location || !contact || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updatedDetails = { name, description, location, contact, email };

  writeCenterDetails(updatedDetails);
  res.json({ message: 'Center details updated successfully', centerDetails: updatedDetails });
};

// Get Controller (Optional: to fetch existing details)
exports.getCenterDetails = (req, res) => {
  const details = readCenterDetails();
  res.json(details);
};
