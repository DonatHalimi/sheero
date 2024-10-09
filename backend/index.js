const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));