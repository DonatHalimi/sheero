require('dotenv').config();

const checkEnvVar = (varName) => {
    const value = process.env[varName];
    if (!value) throw new Error(`⚠️  ${varName} is not defined in the environment variables!`);

    return value;
};

const requiredVars = [
    'BACKEND_PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'NODE_ENV',
    'SESSION_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'FACEBOOK_CLIENT_ID',
    'FACEBOOK_CLIENT_SECRET',
    'SMTP_USER',
    'SMTP_PASS',
    'REDIS_URL',
];

const optionalVars = [
    'JWT_REFRESH_SECRET',
    'SEED_DB',
];

const roles = [
    'ADMIN',
    'USER',
    'CUSTOMER_SUPPORT',
    'ORDER_MANAGER',
    'CONTENT_MANAGER',
    'PRODUCT_MANAGER'
];

const env = {};

for (const key of requiredVars) {
    env[key] = checkEnvVar(key);
}

for (const key of optionalVars) {
    env[key] = process.env[key];
}

for (const role of roles) {
    ['FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PASSWORD'].forEach(field => {
        const key = `${role}_${field}`;
        env[key] = process.env[key];
    });
}

module.exports = env;