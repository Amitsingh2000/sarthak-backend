const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../cloudinary');

const galleryFilePath = path.join(__dirname, '../data/gallery.json');

const readGalleryFromFile = () => {
  try {
    const data = fs.readFileSync(galleryFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading gallery file:', err);
    return [];
  }
};

const writeGalleryToFile = (gallery) => {
  try {
    fs.writeFileSync(galleryFilePath, JSON.stringify(gallery, null, 2));
  } catch (err) {
    console.error('Error writing gallery file:', err);
  }
};

// Get all images
exports.getAllImages = (req, res) => {
  const gallery = readGalleryFromFile();
  res.json(gallery);
};

// Upload image
exports.uploadImage = (req, res) => {
  const gallery = readGalleryFromFile();

  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  const imageUrl = req.file.path; // Cloudinary URL
  const publicId = req.file.filename; // Cloudinary public_id (folder/filename)
  const { category } = req.body;

  let newId = gallery.length > 0 ? Math.max(...gallery.map(img => img.id)) + 1 : 1;

  const newImage = {
    id: newId,
    imageUrl,
    publicId,
    category: category || "gallery",
  };

  gallery.push(newImage);
  writeGalleryToFile(gallery);

  res.status(201).json({
    message: 'Image uploaded successfully!',
    image: newImage
  });
};

// Delete image
exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  let gallery = readGalleryFromFile();
  const imageToDelete = gallery.find(img => img.id === parseInt(id));

  if (!imageToDelete) {
    return res.status(404).json({ message: 'Image not found' });
  }

  try {
    await cloudinary.uploader.destroy(imageToDelete.publicId); // Delete from Cloudinary
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
  }

  gallery = gallery.filter(img => img.id !== parseInt(id));
  writeGalleryToFile(gallery);

  res.json({ message: 'Gallery image deleted successfully!' });
};
