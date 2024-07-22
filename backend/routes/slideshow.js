const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createImage, getImages, getImage, updateImage, deleteImage, deleteImages } = require('../controllers/slideshowController');
const { requireAuthAndRole } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createImage);
router.get('/get', getImages);
router.get('/get:id', getImage);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateImage);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteImage);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteImages);

module.exports = router;