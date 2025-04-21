const nodemailer = require('nodemailer');
const { NODE_ENV, SMTP_USER, SMTP_PASS } = require('../core/dotenv');

const isDevelopment = NODE_ENV === 'development';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  },
  // Allow self-signed certificates in development
  tls: isDevelopment ? { rejectUnauthorized: false } : undefined
});

module.exports = transporter;