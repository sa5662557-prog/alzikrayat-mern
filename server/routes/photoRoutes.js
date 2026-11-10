const express = require('express');
const multer = require('multer');
const path = require('path');
const photoController = require('../controllers/photoController');
const { validate, photoSchema, ownerSchema, idSchema } = require('../middleware/validation');

const router = express.Router();

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `photo-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueName + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only JPG, PNG and GIF images are allowed');
    error.status = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/api/photos', photoController.getAll);
router.get('/api/photos/:id', validate(idSchema, 'params'), photoController.getOne);
router.post('/api/photos', upload.single('photo'), validate(photoSchema), photoController.create);
router.delete('/api/photos/:id', validate(idSchema, 'params'), validate(ownerSchema), photoController.remove);

module.exports = router;
