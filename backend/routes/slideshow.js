const express = require('express');
const router = express.Router();
const { createImage, getImages, getImage, updateImage, deleteImage, deleteImages } = require('../controllers/slideshowController');
const { requireAuthAndRole } = require('../middleware/auth');
const upload = require('../middleware/upload')

router.post('/create', requireAuthAndRole('admin'), upload.single('image'), createImage);
router.get('/get', getImages);
router.get('/get/:id', getImage);
router.put('/update/:id', requireAuthAndRole('admin'), upload.single('image'), updateImage);
router.delete('/delete/:id', requireAuthAndRole('admin'), deleteImage);
router.delete('/delete-bulk', requireAuthAndRole('admin'), deleteImages);

module.exports = router;