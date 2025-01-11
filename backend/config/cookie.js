const { NODE_ENV } = require("./dotenv");

const cookieConfig = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
};

module.exports = cookieConfig;