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
    SESSION_SECRET: checkEnvVar('SESSION_SECRET'),
    GOOGLE_CLIENT_ID: checkEnvVar('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: checkEnvVar('GOOGLE_CLIENT_SECRET'),
    FACEBOOK_CLIENT_ID: checkEnvVar('FACEBOOK_CLIENT_ID'),
    FACEBOOK_CLIENT_SECRET: checkEnvVar('FACEBOOK_CLIENT_SECRET'),
    SMTP_USER: checkEnvVar('SMTP_USER'),
    SMTP_PASS: checkEnvVar('SMTP_PASS'),
    REDIS_URL: checkEnvVar('REDIS_URL'),
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    SEED_DB: process.env.SEED_DB,
    ADMIN_FIRST_NAME: process.env.ADMIN_FIRST_NAME,
    ADMIN_LAST_NAME: process.env.ADMIN_LAST_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};