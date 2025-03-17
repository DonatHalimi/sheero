const FAQ = require('../models/FAQ');

const createFAQ = async (req, res) => {
    const { question, answer } = req.body;

    try {
        const faq = new FAQ({ question, answer, createdBy: req.user.userId });
        await faq.save();
        res.status(201).json({ message: 'FAQ item created successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateFAQ = async (req, res) => {
    const { question, answer } = req.body;

    try {
        const faq = await FAQ.findByIdAndUpdate(
            req.params.id,
            { question, answer, updatedAt: Date.now(), updatedBy: req.user.userId },
            { new: true }
        );
        res.status(200).json({ message: 'FAQ item updated successfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFAQ = async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFAQs = async (req, res) => {
    const { ids } = req.body;

    try {
        await FAQ.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'FAQ items deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createFAQ, getFAQs, getFAQ, updateFAQ, deleteFAQ, deleteFAQs };