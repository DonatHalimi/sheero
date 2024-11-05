const FAQ = require('../models/FAQ');

const createFAQ = async (req, res) => {
    const { question, answer } = req.body;
    try {
        const faq = new FAQ({ question, answer });
        await faq.save();
        res.status(201).json({ message: 'FAQ item created succesfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
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
            { question, answer, updatedAt: Date.now() },
            { new: true }
        );
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });
        res.status(200).json({ message: 'FAQ item updated succesfully', faq });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) return res.status(404).json({ message: 'FAQ not found' });

        await FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteFAQs = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const faqs = await FAQ.find({ _id: { $in: ids } });

        if (faqs.length !== ids.length) {
            return res.status(404).json({ message: 'One or more faq items not found' });
        }

        await FAQ.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'FAQ items deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createFAQ, getFAQs, getFAQ, updateFAQ, deleteFAQ, deleteFAQs };