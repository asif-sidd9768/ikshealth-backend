// routes.js
const express = require('express');
const multer = require('multer')
const { getAllUsers, getCountries, getStates, getCities, fileUpload, updateUser } = require('../controllers/form.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo' + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({ storage: storage });
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const router = express.Router();

router.get('/', getAllUsers);
router.get('/api/countries', getCountries);
router.post('/api/file-upload', upload.single('photo'), fileUpload);
router.post('/api/users/:id', upload.single('photo'), updateUser);
router.get('/api/:country/states', getStates);
router.get('/api/:country/:state/cities', getCities);

module.exports = router;
