const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Dynamic folder setup based on route
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';

    if (req.baseUrl.includes('gallery')) {
      folder = 'galleryImg';
    } else if (req.baseUrl.includes('courses')) {
      folder = 'courseImg';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = { cloudinary, upload };
