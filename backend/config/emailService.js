const { SMTP_USER, NODE_ENV } = require('./dotenv');
const { statusImages, returnStatusImages, createAttachments, generateEmailVerificationHtml, generateOrderEmailHtml, generateReturnRequestEmailHtml, generateReviewEmailHtml,
    brandImages, headerMessages, returnStatusMessages, returnBodyMessages, orderStatusMessages, orderBodyMessages,
    generateProductInventoryEmailHtml, generateResetPasswordEmailHtml, generatePasswordResetSuccessEmailHtml,
    generateEnable2FAEmailHtml, generateDisable2FAEmailHtml, generateLogin2FAEmailHtml,
    generateProductInventoryUpdateHtml, generateProductRestockSubHtml,
    generateContactHtml, generateContactToAdminsHtml
} = require('./emailUtils');
const transporter = require('./mailer');
const Role = require('../models/Role');
const User = require('../models/User');

async function sendEmail(userEmail, subject, text, html, attachments = []) {
    const mailOptions = {
        from: `"sheero" <${SMTP_USER}>`,
        to: userEmail,
        subject,
        text: `${text}\n\nNote: This is an automated email. Please do not reply.`,
        html: `${html}<p style="font-size: 12px; color: #777;">Note: This is an automated email. Please do not reply.</p>`,
        attachments
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendVerificationEmail(userEmail, otp) {
    const subject = 'OTP Verification Code for sheero';
    const text = `Hello ${userEmail},\n\nYour OTP is: ${otp}\n\nIt will expire in 2 minutes.`;
    const html = generateEmailVerificationHtml(userEmail, otp);

    return sendEmail(userEmail, subject, text, html);
};

async function sendOrderUpdateEmail(order) {
    if (!order || !order.user) {
        console.error('Invalid order object');
        return;
    }

    const { orderAttachments, returnRequestAttachments } = createAttachments(order, undefined);
    const attachments = [...orderAttachments, ...returnRequestAttachments];

    const orderSubjectMessages = {
        pending: `Order #${order._id} has been received.`,
        processed: `Order #${order._id} has been processed.`,
        shipped: `Order #${order._id} has been shipped.`,
        delivered: `Order #${order._id} has been delivered.`,
        canceled: `Order #${order._id} has been canceled.`,
    };

    const subject = orderSubjectMessages[order.status];
    const text = `Hello ${order.user.email},\nThe order #${order._id} you've made at sheero has been updated to: ${order.status}.`;

    const html = generateOrderEmailHtml(order, {
        brandImages,
        headerMessages,
        orderStatusMessages,
        orderBodyMessages,
        statusImages,
    });

    return sendEmail(order.user.email, subject, text, html, attachments);
}

async function sendReturnRequestUpdateEmail(returnRequest) {
    if (!returnRequest || !returnRequest._id) {
        throw new Error('Invalid return request object');
    }

    if (!returnRequest.products || !Array.isArray(returnRequest.products)) {
        returnRequest.products = [];
    }

    const { orderAttachments, returnRequestAttachments } = createAttachments(undefined, returnRequest);
    const attachments = [...orderAttachments, ...returnRequestAttachments];

    const returnSubjectMessages = {
        pending: `Return Request #${returnRequest._id} has been received.`,
        approved: `Return Request #${returnRequest._id} has been approved.`,
        processed: `Return Request #${returnRequest._id} has been processed.`,
        rejected: `Return Request #${returnRequest._id} has been rejected.`,
    };

    const subject = returnSubjectMessages[returnRequest.status];
    const text = `Return Request ${returnRequest.status} - ${returnRequest._id}`;

    const html = generateReturnRequestEmailHtml(returnRequest, {
        brandImages,
        headerMessages,
        returnStatusMessages,
        returnBodyMessages,
        returnStatusImages,
    });

    return sendEmail(returnRequest.user.email, subject, text, html, attachments);
}

async function sendReviewEmail(review) {
    if (!review || !review._id) {
        throw new Error('Invalid review object');
    }

    const { orderAttachments, returnRequestAttachments, reviewAttachments } = createAttachments(undefined, undefined, review);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments];

    const subject = `Review for ${review.product.name} at sheero`;
    const text = `Review #${review._id}`;

    const html = generateReviewEmailHtml(review, {
        brandImages,
    });

    await sendEmail(review.user.email, subject, text, html, attachments);
}

async function sendProductInventoryUpdateEmail(order) {
    if (!order || !order.user) {
        console.error('Invalid order object');
        return;
    }

    const { orderAttachments, returnRequestAttachments } = createAttachments(order, undefined);
    const attachments = [...orderAttachments, ...returnRequestAttachments];

    const subject = `Order #${order._id} Product Inventory Update`;
    const text = `\n\Products inventory update for order #${order._id}.`;

    try {
        // Fetch the 'admin' role ObjectId
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.error('Admin role not found');
            return;
        }

        // Fetch all users with the 'admin' role ObjectId
        const adminUsers = await User.find({ role: adminRole._id });

        if (adminUsers.length === 0) {
            console.log('No admin users found');
            return;
        }

        // Send the email to each admin user
        for (const admin of adminUsers) {
            const html = generateProductInventoryEmailHtml(order, {
                recipientEmail: admin.email,
                brandImages,
                headerMessages,
                orderStatusMessages,
                orderBodyMessages,
                statusImages,
            });

            await sendEmail(admin.email, subject, text, html, attachments);
        }
    } catch (error) {
        console.error('Error sending emails to admins:', error);
    }
}

async function sendResetPasswordEmail(user, resetToken) {
    const frontendURL = NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000';

    const resetUrl = `${frontendURL}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const text = `Hello ${user.email},\n\nPlease click the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email.`;
    const html = generateResetPasswordEmailHtml(user, resetUrl);

    await sendEmail(user.email, subject, text, html);
}

async function sendPasswordResetSuccessEmail(user) {
    const subject = 'Password Reset Success';
    const text = `Hello ${user.email},\n\nYour password has been successfully reset.`;
    const html = generatePasswordResetSuccessEmailHtml(user);

    await sendEmail(user.email, subject, text, html);
}

async function sendEnable2FAEmail(userEmail, otp) {
    const subject = 'Enabling Two-Factor Authentication Code';
    const text = `Hello ${userEmail},\n\nYour One-Time Password (OTP) for enabling two-factor authentication is: ${otp}\n\nIt will expire in 10 minutes.`;

    const html = generateEnable2FAEmailHtml(userEmail, otp);
    await sendEmail(userEmail, subject, text, html);
}

async function sendDisable2FAEmail(userEmail, otp) {
    const subject = 'Disabling Two-Factor Authentication Code';
    const text = `Hello ${userEmail},\n\nYour One-Time Password (OTP) for disabling two-factor authentication is: ${otp}\n\nIt will expire in 10 minutes.`;

    const html = generateDisable2FAEmailHtml(userEmail, otp);
    await sendEmail(userEmail, subject, text, html);
}

async function sendLogin2FAEmail(userEmail, otp) {
    const subject = 'Login Two-Factor Authentication Code';
    const text = `Hello ${userEmail},\n\nYour two-factor authentication OTP is: ${otp}\n\nIt will expire in 5 minutes.`;

    const html = generateLogin2FAEmailHtml(userEmail, otp);
    await sendEmail(userEmail, subject, text, html);
}

async function sendProductRestockNotificationEmail(email, product) {
    const { orderAttachments, returnRequestAttachments, reviewAttachments, productInventoryAttachments } = createAttachments(undefined, undefined, undefined, product);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments, ...productInventoryAttachments];

    const subject = `Product '${product.name}' is now in stock!`;
    const text = `Hello,\nThe product "${product.name}" you subscribed to is now in stock.`;

    const html = generateProductInventoryUpdateHtml(email, product, {
        brandImages,
    });

    await sendEmail(email, subject, text, html, attachments);
}

async function sendProductRestockSubscriptionEmail(email, product) {
    const { orderAttachments, returnRequestAttachments, reviewAttachments, productInventoryAttachments } = createAttachments(undefined, undefined, undefined, product);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments, ...productInventoryAttachments];

    const subject = `You've subscribed to the product restock updates for '${product.name}'!`;
    const text = `Hello,\n We will notify you as soon as the product "${product.name}" is back in stock.`;

    const html = generateProductRestockSubHtml(email, product, {
        brandImages,
    });

    await sendEmail(email, subject, text, html, attachments);
}

async function sendContactEmail(contact) {
    if (!contact || !contact._id) {
        throw new Error('Invalid contact object');
    }

    const { orderAttachments, returnRequestAttachments, reviewAttachments, productInventoryAttachments } = createAttachments(undefined, undefined, undefined, contact);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments, ...productInventoryAttachments];

    const subject = `Thank you for reaching out to sheero!`;
    const text = `Dear ${contact.name},\n\nThank you for taking the time to contact us. We will review your message and get back to you as soon as possible.\n\nBest regards, sheero team`;

    const html = generateContactHtml(contact, {
        brandImages,
    });

    await sendEmail(contact.email, subject, text, html, attachments);
}

async function sendContactEmail(contact) {
    if (!contact || !contact._id) {
        throw new Error('Invalid contact object');
    }

    const { orderAttachments, returnRequestAttachments, reviewAttachments, productInventoryAttachments } = createAttachments(undefined, undefined, undefined, contact);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments, ...productInventoryAttachments];

    const subject = `Thank you for reaching out to sheero!`;
    const text = `We will read your message and get back to you as soon as possible.\n\nBest regards, sheero`;

    const html = generateContactHtml(contact, {
        brandImages,
    });

    await sendEmail(contact.email, subject, text, html, attachments);
}

async function sendContactEmailToAdmins(contact) {
    const { orderAttachments, returnRequestAttachments, reviewAttachments, productInventoryAttachments } = createAttachments(undefined, undefined, undefined, contact);
    const attachments = [...orderAttachments, ...returnRequestAttachments, ...reviewAttachments, ...productInventoryAttachments];

    const subject = `New message from ${contact.name}!`;
    const text = `Please get back to ${contact.email} as soon as possible.\n\nBest regards, sheero.`;

    try {
        // Fetch the 'admin' role ObjectId
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.error('Admin role not found');
            return;
        }

        // Fetch all users with the 'admin' role ObjectId
        const adminUsers = await User.find({ role: adminRole._id });

        if (adminUsers.length === 0) {
            console.log('No admin users found');
            return;
        }

        // Send the email to each admin user
        for (const admin of adminUsers) {
            const html = generateContactToAdminsHtml(contact, {
                recipientEmail: admin.email,
                brandImages,
            });

            await sendEmail(admin.email, subject, text, html, attachments);
        }
    } catch (error) {
        console.error('Error sending emails to admins:', error);
    }
}

module.exports = {
    sendVerificationEmail, sendOrderUpdateEmail, sendReturnRequestUpdateEmail, sendReviewEmail, sendProductInventoryUpdateEmail,
    sendResetPasswordEmail, sendPasswordResetSuccessEmail, sendEnable2FAEmail, sendDisable2FAEmail, sendLogin2FAEmail, sendProductRestockNotificationEmail, sendProductRestockSubscriptionEmail,
    sendContactEmail, sendContactEmailToAdmins
};