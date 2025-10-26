module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },
  email: {
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  upload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    path: process.env.UPLOAD_PATH || './uploads'
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};