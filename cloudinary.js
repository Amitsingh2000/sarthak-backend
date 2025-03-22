const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary config
cloudinary.config({
  cloud_name: 'dgg5eosoq',
  api_key: '636134686546496',
  api_secret: 'E3qePlKiSYP6-AQ-Sx6jdZI_lyc',
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
