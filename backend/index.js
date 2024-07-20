const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const countryRoutes = require('./routes/country');
const cityRoutes = require('./routes/city');
const subcategoryRoutes = require('./routes/subcategory');
const userRoutes = require('./routes/user');
const addressRoutes = require('./routes/address')
const supplierRoutes = require('./routes/supplier')
const reviewRoutes = require('./routes/review')

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/addresses', addressRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/reviews', reviewRoutes)

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));