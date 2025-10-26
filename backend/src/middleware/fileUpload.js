const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = './uploads';
const productsDir = './uploads/products';
const certificationsDir = './uploads/certifications';
const reviewsDir = './uploads/reviews';
const profilesDir = './uploads/profiles';

[uploadsDir, productsDir, certificationsDir, reviewsDir, profilesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = productsDir;
    
    if (req.path.includes('certifications')) {
      uploadPath = certificationsDir;
    } else if (req.path.includes('reviews')) {
      uploadPath = reviewsDir;
    } else if (req.path.includes('profile')) {
      uploadPath = profilesDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter
});

module.exports = upload;