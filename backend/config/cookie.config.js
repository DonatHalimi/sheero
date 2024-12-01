const cookieConfig = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? 'sheero.onrender.com' : 'localhost'
};

module.exports = cookieConfig;