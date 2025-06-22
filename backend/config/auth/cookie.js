const { NODE_ENV } = require("../core/dotenv");

const accessCookieConfig = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/'
};

const refreshCookieConfig = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
};

module.exports = { accessCookieConfig, refreshCookieConfig };