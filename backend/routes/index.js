const express = require('express');
const router = express.Router();

const routes = [
    { path: '/addresses', route: require('./address') },
    { path: '/auth', route: require('./auth') },
    { path: '/cart', route: require('./cart') },
    { path: '/categories', route: require('./category') },
    { path: '/cities', route: require('./city') },
    { path: '/contact', route: require('./contact') },
    { path: '/countries', route: require('./country') },
    { path: '/faqs', route: require('./faq') },
    { path: '/orders', route: require('./order') },
    { path: '/protected', route: require('./protected') },
    { path: '/products', route: require('./product') },
    { path: '/returns', route: require('./return') },
    { path: '/reviews', route: require('./review') },
    { path: '/roles', route: require('./role') },
    { path: '/slideshow', route: require('./slideshow') },
    { path: '/subcategories', route: require('./subcategory') },
    { path: '/subsubcategories', route: require('./subSubcategory') },
    { path: '/suppliers', route: require('./supplier') },
    { path: '/users', route: require('./user') },
    { path: '/wishlist', route: require('./wishlist') },
    { path: '/notifications', route: require('./notification') },
];

routes.forEach(({ path, route }) => router.use(path, route));

module.exports = router;