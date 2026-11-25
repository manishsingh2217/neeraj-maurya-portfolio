const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(__dirname, '..', 'uploads');
    if (file.fieldname === 'resourceFile') {
      dest = path.join(dest, 'resources');
    } else if (file.mimetype === 'application/pdf') {
      dest = path.join(dest, 'resumes');
    } else if (file.mimetype.startsWith('image/')) {
      dest = path.join(dest, 'images');
    } else {
      dest = path.join(dest, 'misc');
    }

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${basename}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow all standard safe assets, documents, archives, notebooks and spreadsheets
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.pdf', '.zip', '.rar', '.xlsx', '.xls', '.csv', '.ipynb', '.pbix', '.txt', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${ext}). Allowed: ${allowedExts.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max
  }
});

module.exports = upload;
