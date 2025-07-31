/**
 * Multer middleware for file uploads (accepts .csv and .xlsx only).
 * Logs file info for debugging. Place in middleware/upload.js for modularity.
 */
const multer = require('multer');
const path = require('path');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    console.log('Uploaded file name:', file.originalname); // Debugging line
    const ext = path.extname(file.originalname).toLowerCase();
    console.log('File extension:', ext); // Debugging line
    if (ext === '.csv' || ext === '.xlsx') {
      console.log('File is valid'); // Debugging line
      cb(null, true);
    } else {
      console.log('File is invalid'); // Debugging line
      cb(new Error('Only .csv and .xlsx files are allowed'));
    }
  }
});

module.exports = upload;
