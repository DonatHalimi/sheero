const transporter = require('./mailer');

async function sendVerificationEmail(userEmail, otp) {
    const mailOptions = {
        from: `"sheero" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: 'OTP verification code for sheero',
        text: `Hello ${userEmail},\n\nThank you for signing up with sheero! Your One-Time Password (OTP) is: ${otp}\n\nPlease enter this code to complete your registration. It will expire in 2 minutes.\n\nIf you did not request this, you can safely ignore this email.\n\nBest regards,\nsheero Team (https://sheero.onrender.com)`,
        html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hello, <strong>${userEmail}</strong>,</p>
                <p>Thank you for signing up with <a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: none; font-weight: bold;">sheero</a>! Your One-Time Password (OTP) is:</p>
                <h2 style="color: #57534E;">${otp}</h2>
                <p>Please enter this code to complete your registration. It will expire in <strong>2 minutes</strong>.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p>Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: none;">sheero</a></strong></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = sendVerificationEmail;