const { NODE_ENV } = require('./dotenv');
const transporter = require('./mailer');

async function sendEmail(userEmail, subject, text, html) {
    const mailOptions = {
        from: `"sheero" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject,
        text: `${text}\n\nNote: This is an automated email. Please do not reply.`,
        html: `${html}<p style="font-size: 12px; color: #777;">Note: This is an automated email. Please do not reply.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function sendVerificationEmail(userEmail, otp) {
    const subject = 'OTP verification code for sheero';
    const text = `Hello ${userEmail},\n\nYour OTP is: ${otp}\n\nIt will expire in 2 minutes.`;
    const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hello, <strong>${userEmail}</strong>,</p>
                <p>Thank you for signing up with <a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: none; font-weight: bold;">sheero</a>! Your One-Time Password (OTP) is:</p>
                <h2 style="color: #57534E;">${otp}</h2>
                <p>Please enter this code to complete your registration. It will expire in <strong>2 minutes</strong>.</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <p>Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong></p>
            </div>
        `
    return sendEmail(userEmail, subject, text, html);
};

async function sendOrderUpdateEmail(order) {
    if (!order || !order.user) {
        console.error('Invalid order object');
        return;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatPrice = (price) => {
        return price?.toFixed(2) || 'N/A';
    };

    const getStatusProgress = (status) => {
        switch (status) {
            case 'pending':
                return 25;
            case 'shipped':
                return 50;
            case 'delivered':
                return 100;
            case 'canceled':
                return 0;
            default:
                return 0;
        }
    };

    const BASE_URL = NODE_ENV === 'production'
        ? 'https://sheero-backend.onrender.com'
        : 'http://localhost:5000';

    // TODO: fix product image not showing up in email
    const getImageUrl = (imagePath) => `${BASE_URL}/${imagePath}`;

    const statusMessages = {
        pending: `We have successfully received your order! <br>After we review the availability of your items, your order will be processed.</br>`,
        shipped: `We are happy to inform you that we have verified and shipped your order!`,
        delivered: `Your order has been delivered successfully. We hope you enjoy your purchase!`,
        canceled: `Unfortunately, your order has been canceled.`,
    };

    const subjectMessages = {
        pending: `Order #${order._id} has been received.`,
        shipped: `Order #${order._id} has been verified.`,
        delivered: `Order #${order._id} has been delivered.`,
        canceled: `Order #${order._id} has been canceled.`,
    };

    const subject = subjectMessages[order.status];
    const text = `Hello ${order.user.email},\n\The order #${order._id} you've made at sheero has been updated to: ${order.status}.`;

    const html = `
        <div style="font-family: Outfit, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div>
                <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${order.user.firstName}</strong>,</p>
                <p style="font-size: 14px; font-weight: 500; margin-bottom: 8px;">Thank you for your order at sheero</p>
                <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
                <strong>${statusMessages[order.status]}</strong>
                <p>Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong></p>
                </p>   
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 8px;">
                        Order #${order._id} Status
                    </p>
                    <p style="font-size: 14px; color: #666; text-align: center;">
                        Order Date: ${formatDate(order.createdAt)}
                    </p>
                    ${order.status === 'delivered' ? `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                            Arrival Date: ${formatDate(order.arrivalDateRange.start)}
                    </p>` :
                `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                            Arrival Date: ${formatDate(order.arrivalDateRange.start)} - ${formatDate(order.arrivalDateRange.end)}
                    </p>`
        }
                <div style="height: 20px; width: 60%; margin: auto; background-color: #e0e0e0; border-radius: 4px;">
                   <div style="height: 100%; width: ${getStatusProgress(order.status)}%; background-color: #5B504B; border-radius: 4px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; width: 60%; margin: auto; margin-top: 8px; position: relative;">
                    ${order.status === 'canceled' ?
            `<span style="font-weight: 600; background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px;">Canceled</span>` :
            `
                           <span style="position: absolute; left: 0; ${order.status === 'pending' ? 'font-weight: 600; background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px;' : ''}">Pending</span>
                           <span style="position: absolute; left: 50%; transform: translateX(-50%); ${order.status === 'shipped' ? 'font-weight: 600; background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px;' : ''}">Shipped</span>
                           <span style="position: absolute; right: 0; ${order.status === 'delivered' ? 'font-weight: 600; background-color: #f5f5f5; padding: 4px 8px; border-radius: 4px;' : ''}">Delivered</span>
            `
        }
                </div>
                <div style="border-bottom: 1px solid #e0e0e0; width: 100%; margin: auto; margin-top: 14px;"></div>
                    <div>
                        <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                        <a href="https://sheero.onrender.com/profile/orders/${order._id}" style="color: #57534E; text-decoration: underline; font-weight: bold;">Order status</a
                        </p>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">${order.products.length > 1 ? 'Products' : 'Product'}</th>
                                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.products.map(({ product, quantity, price }) => `
                                <tr key="${product._id}">
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                                        <div style="display: flex; align-items: center;">
                                            <img src="${getImageUrl(product.image)}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: contain; margin-right: 8px; border-radius: 4px;" />
                                            <div>
                                                <div style="font-weight: 500;">${product.name}</div>
                                                <div style="font-size: 14px; color: #666;">Quantity: ${quantity}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                                        € ${formatPrice(price)}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tbody>
                            <tr>
                                <td style="padding: 8px; font-weight: 600;">Subtotal:</td>
                                <td style="text-align: right; padding: 8px;">
                                    € ${formatPrice(order.products.reduce((total, { quantity, price }) => total + (price * quantity), 0))}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: 600;">Shipping:</td>
                                <td style="text-align: right; padding: 8px;">€ 2.00</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: 600;">Grand Total:</td>
                                <td style="text-align: right; padding: 8px; font-weight: 600;">
                                    € ${formatPrice(order.totalAmount)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div>
                        <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Shipping Address</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Name:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Country:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.country?.name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">City:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.city?.name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Zip Code:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.city?.zipCode || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Street:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.street || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Phone Number:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.phoneNumber || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Comment:</td>
                                    <td style="text-align: right; padding: 8px;">${order.address?.comment || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Payment Information</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Payment Method:</td>
                                    <td style="text-align: right; padding: 8px;">
                                        ${order.paymentMethod ? order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1) : 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: 600;">Payment Status:</td>
                                    <td style="text-align: right; padding: 8px;">
                                        ${order.paymentMethod === 'stripe' && order.paymentStatus === 'succeeded' ? 'Successful' : (order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
                </p>
            </div>
        </div>
    `;

    return sendEmail(order.user.email, subject, text, html);
}

module.exports = { sendVerificationEmail, sendOrderUpdateEmail };