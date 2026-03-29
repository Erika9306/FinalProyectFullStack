const { cloudinary } = require('../config/cloudinary'); 
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Movies Library',
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  },
});

const upload = multer({ storage });

module.exports = { upload }

