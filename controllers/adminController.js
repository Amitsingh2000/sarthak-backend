const fs = require('fs');
const path = require('path');

const adminLogin = (req, res) => {
  const { email, password } = req.body;
  const adminData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/admin.json')));

  if (email === adminData.email && password === adminData.password) {
    return res.status(200).json({ message: 'Login successful' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { adminLogin };
