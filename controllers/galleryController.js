const fs = require('fs');
const path = require('path');

// JSON file to store gallery image details
const galleryFilePath = path.join(__dirname, '../data/gallery.json');

// Helper: Read gallery data
const readGalleryFromFile = () => {
  try {
    const data = fs.readFileSync(galleryFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading gallery file:', err);
    return [];
  }
};

// Helper: Write gallery data
const writeGalleryToFile = (gallery) => {
  try {
    fs.writeFileSync(galleryFilePath, JSON.stringify(gallery, null, 2));
  } catch (err) {
    console.error('Error writing gallery file:', err);
  }
};

// Get all gallery images
exports.getAllImages = (req, res) => {
  const gallery = readGalleryFromFile();
  res.json(gallery);
};

// Upload a new image
exports.uploadImage = (req, res) => {
  const gallery = readGalleryFromFile();

  const image = req.file ? req.file.filename : '';
  const { category } = req.body;

  if (!image) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  let newId = 1;
  if (gallery.length > 0) {
    const maxId = Math.max(...gallery.map(img => img.id));
    newId = maxId + 1;
  }

  const newImage = {
    id: newId,
    image,
    category: category || "default" // Add category with default value
  };

  gallery.push(newImage);
  writeGalleryToFile(gallery);

  res.status(201).json({ message: 'Image uploaded successfully!', image: newImage });
};

// Delete a gallery image
exports.deleteImage = (req, res) => {
  const { id } = req.params;
  let gallery = readGalleryFromFile();
  const imageToDelete = gallery.find(img => img.id === parseInt(id));

  if (!imageToDelete) {
    return res.status(404).json({ message: 'Image not found' });
  }

  gallery = gallery.filter(img => img.id !== parseInt(id));
  writeGalleryToFile(gallery);

  const imagePath = path.join(__dirname, '../uploads/gallery', imageToDelete.image);
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error('Error deleting image file:', err);
      return res.json({ message: 'Image deleted from records, but file deletion failed' });
    }
    res.json({ message: 'Gallery image deleted successfully!' });
  });
};
