const { NODE_ENV } = require('./dotenv');

const corsOptions = {
    origin: NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie'],
};

module.exports = corsOptions;