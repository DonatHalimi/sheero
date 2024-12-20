const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static('frontend/build'));

    // Handle React routing
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection to MongoDB failed:', err));

app.use((req, res, next) => {
    console.log('Request Cookies:', req.cookies);
    next();
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server is running at \x1b[4mhttp://localhost:${PORT}\x1b[0m`));