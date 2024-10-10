const express = require('express');
const router = express.Router();

// Import routes
const addressRoutes = require('./address');
const authRoutes = require('./auth');
const cartRoutes = require('./cart');
const categoryRoutes = require('./category');
const cityRoutes = require('./city');
const contactRoutes = require('./contact');
const countryRoutes = require('./country');
const faqRoutes = require('./faq');
const orderRoutes = require('./order');
const productRoutes = require('./product');
const protectedRoutes = require('./protected');
const reviewRoutes = require('./review');
const roleRoutes = require('./role');
const slideshowRoutes = require('./slideshow');
const subcategoryRoutes = require('./subcategory');
const subSubcategoryRoutes = require('./subSubcategory');
const supplierRoutes = require('./supplier');
const userRoutes = require('./user');
const wishlistRoutes = require('./wishlist');

// Define routes
router.use('/addresses', addressRoutes);
router.use('/auth', authRoutes);
router.use('/cart', cartRoutes);
router.use('/categories', categoryRoutes);
router.use('/cities', cityRoutes);
router.use('/contact', contactRoutes);
router.use('/countries', countryRoutes);
router.use('/faqs', faqRoutes);
router.use('/orders', orderRoutes);
router.use('/protected', protectedRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/roles', roleRoutes)
router.use('/slideshow', slideshowRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/subsubcategories', subSubcategoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;