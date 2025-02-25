const express = require('express');
const { createImage, getImages, getImageById, updateImage, deleteImage, deleteImages } = require('../controllers/slideshowController');
const { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema } = require('../validations/slideshow');
const { requireAuthAndRole } = require('../middleware/auth');
const upload = require('../middleware/upload')
const validate = require('../middleware/validation');

const router = express.Router();

router.post('/create', requireAuthAndRole(['admin', 'contentManager']), upload.single('image'), validate(createSchema), createImage);
router.get('/get', getImages);
router.get('/get/:id', validate(getByIdSchema), getImageById);
router.put('/update/:id', requireAuthAndRole(['admin', 'contentManager']), upload.single('image'), validate(updateSchema), updateImage);
router.delete('/delete/:id', requireAuthAndRole(['admin', 'contentManager']), validate(deleteSchema), deleteImage);
router.delete('/delete-bulk', requireAuthAndRole(['admin', 'contentManager']), validate(deleteBulkSchema), deleteImages);

module.exports = router;