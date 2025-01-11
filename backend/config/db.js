const mongoose = require('mongoose');
const { seedDB } = require('../middleware/seeder');
const { MONGODB_URI } = require('./dotenv');

const connectDB = async () => {
    mongoose.connect(MONGODB_URI)
        .then(async () => {
            console.log(`✓ Connected to \x1b]8;;https://cloud.mongodb.com\x1b\\MongoDB\x1b]8;;\x1b\\`);

            seedDB();
        })
        .catch(err => console.error('⚠️  Connection to MongoDB failed:', err));
};

module.exports = connectDB;