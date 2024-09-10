const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const addressRoutes = require('./routes/address');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/category');
const cityRoutes = require('./routes/city');
const countryRoutes = require('./routes/country');
const faqRoutes = require('./routes/faq');
const protectedRoutes = require('./routes/protected');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const slideshowRoutes = require('./routes/slideshow');
const subcategoryRoutes = require('./routes/subcategory');
const subSubcategoryRoutes = require('./routes/subSubcategory');
const supplierRoutes = require('./routes/supplier');
const userRoutes = require('./routes/user');
const wishlistRoutes = require('./routes/wishlist');

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use('/api/addresses', addressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/slideshow', slideshowRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/subsubcategories', subSubcategoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));