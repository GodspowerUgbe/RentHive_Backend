const cloudinary = require('cloudinary').v2;
const  CloudinaryStorage  = require('multer-storage-cloudinary');

const APP_ROOT = process.env.APP_NAME || 'renthive';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Property Images (Large, High Quality)
const houseStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `${APP_ROOT}/properties/${req.params.houseId || 'temp'}`,
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  }),
});


    
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `${APP_ROOT}/profiles/${req.user.id}`,
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 300, height: 300, crop: 'thumb', gravity: 'face' },
    ],
  }),
});


const docStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `${APP_ROOT}/escrow/${req.params.escrowId}`,
    resource_type: 'auto',
    allowed_formats: ['pdf', 'docx', 'txt', 'jpg', 'png', 'jpeg'],
  }),
});

const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: `${APP_ROOT}/chat/${req.params.conversationId}`,
    resource_type: 'auto',
  }),
});

module.exports = { houseStorage, profileStorage, docStorage, chatStorage };
