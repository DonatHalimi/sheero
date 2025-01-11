require('dotenv').config();

const checkEnvVar = (varName) => {
    const value = process.env[varName];
    if (!value) {
        throw new Error(`⚠️  ${varName} is not defined in the environment variables!`);
    }
    return value;
};

module.exports = {
    BACKEND_PORT: checkEnvVar('BACKEND_PORT'),
    MONGODB_URI: checkEnvVar('MONGODB_URI'),
    JWT_SECRET: checkEnvVar('JWT_SECRET'),
    STRIPE_SECRET_KEY: checkEnvVar('STRIPE_SECRET_KEY'),
    NODE_ENV: checkEnvVar('NODE_ENV'),
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    SEED_DB: process.env.SEED_DB,
    ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};