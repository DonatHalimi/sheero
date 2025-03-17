const SlideshowImage = require('../models/SlideshowImage');
const fs = require('fs');

const createImage = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : '';

    try {
        const slideshowImage = new SlideshowImage({ title, image, description, createdBy: req.user.userId });
        await slideshowImage.save();
        res.status(201).json({ message: 'Slideshow image created successfully', slideshowImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await SlideshowImage.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getImageById = async (req, res) => {
    try {
        const image = await SlideshowImage.findById(req.params.id);
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateImage = async (req, res) => {
    const { title, description } = req.body;
    let image = req.body.image;
    try {
        const oldImage = await SlideshowImage.findById(req.params.id);
        if (!oldImage) return res.status(404).json({ message: 'Image not found' });

        if (req.file) {
            if (oldImage.image) {
                fs.unlink(oldImage.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = req.file.path;
        } else if (image === null || image === '') {
            if (oldImage.image) {
                fs.unlink(oldImage.image, (err) => {
                    if (err) console.error('Error deleting old image:', err);
                });
            }
            image = '';
        }

        const updatedImage = await SlideshowImage.findByIdAndUpdate(
            req.params.id,
            { title, image, description, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        res.status(200).json({ message: 'Slideshow image updated successfully', updatedImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await SlideshowImage.findById(req.params.id);

        if (image.image) {
            fs.unlink(image.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await SlideshowImage.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteImages = async (req, res) => {
    const { ids } = req.body;

    try {
        const images = await SlideshowImage.find({ _id: { $in: ids } });

        for (const image of images) {
            if (image.image) {
                fs.unlink(image.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await SlideshowImage.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Images deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createImage, getImages, getImageById, updateImage, deleteImage, deleteImages };
