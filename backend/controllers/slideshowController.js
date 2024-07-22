const SlideshowImage = require('../models/SlideshowImage');
const fs = require('fs');

const createImage = async (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : '';
    try {
        const slideshowImage = new SlideshowImage({ title, image, description });
        await slideshowImage.save();
        res.status(201).json(slideshowImage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getImages = async (req, res) => {
    try {
        const images = await SlideshowImage.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getImage = async (req, res) => {
    try {
        const image = await SlideshowImage.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });
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
            { title, image, description, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(updatedImage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await SlideshowImage.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Image not found' });

        if (image.image) {
            fs.unlink(image.image, (err) => {
                if (err) console.error('Error deleting image:', err);
            });
        }

        await SlideshowImage.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteImages = async (req, res) => {
    const { imageIds } = req.body;
    try {
        const images = await SlideshowImage.find({ _id: { $in: imageIds } });

        if (images.length !== imageIds.length) {
            return res.status(404).json({ message: 'One or more images not found' });
        }

        for (const image of images) {
            if (image.image) {
                fs.unlink(image.image, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        await SlideshowImage.deleteMany({ _id: { $in: imageIds } });

        res.status(200).json({ message: 'Images deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createImage, getImages, getImage, updateImage, deleteImage, deleteImages };
