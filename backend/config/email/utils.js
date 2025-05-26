const { NODE_ENV } = require("../core/dotenv");
const fs = require('fs');
const path = require('path');

const BASE_URL = NODE_ENV === 'production'
  ? 'https://sheero-backend.onrender.com'
  : 'http://localhost:5000';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatPrice = (price) => {
  return price?.toFixed(2) || 'N/A';
};

const cleanImagePath = (imagePath) => {
  return imagePath.replace(/^uploads[\/\\]/, '').replace(/^[\/\\]uploads[\/\\]/, '');
};

const getImageUrl = (imagePath) => {
  try {
    const cleanPath = cleanImagePath(imagePath);

    const fullPath = path.join(__dirname, '..', '..', 'uploads', cleanPath);

    if (!fs.existsSync(fullPath)) {
      console.error(`Image not found: ${fullPath}`);
      return null;
    }

    return `${BASE_URL}/uploads/${cleanPath}`;
  } catch (error) {
    console.error('Error in getImageUrl:', error);
    return null;
  }
};

const statusImages = {
  pending: getImageUrl('pending.png'),
  processed: getImageUrl('orderProcessed.png'),
  shipped: getImageUrl('shipped.png'),
  delivered: getImageUrl('delivered.png'),
  canceled: getImageUrl('canceled.png'),
};

const returnStatusImages = {
  pending: getImageUrl('returnPending.png'),
  approved: getImageUrl('approved.png'),
  processed: getImageUrl('processed.png'),
  rejected: getImageUrl('rejected.png'),
};

const getUploadPath = (...segments) => path.join(__dirname, '..', '..', 'uploads', ...segments);

const createAttachments = (order = {}, returnRequest = {}, review = {}, productInventory = {}) => {
  const orderAttachments = [], returnRequestAttachments = [], reviewAttachments = [], productInventoryAttachments = [];

  if (order.status && statusImages[order.status]) {
    orderAttachments.push({
      filename: order.status === 'processed' ? 'orderProcessed.png' : `${order.status}.png`,
      path: getUploadPath(order.status === 'processed' ? 'orderProcessed.png' : `${order.status}.png`),
      cid: 'statusImage'
    });
  }

  if (returnRequest.status && returnStatusImages[returnRequest.status]) {
    returnRequestAttachments.push({
      filename: returnRequest.status === 'pending' ? 'returnPending.png' : `${returnRequest.status}.png`,
      path: getUploadPath(returnRequest.status === 'pending' ? 'returnPending.png' : `${returnRequest.status}.png`),
      cid: 'returnRequestImage'
    });
  }

  if (brandImages.logo) {
    orderAttachments.push({
      filename: 'logo.png',
      path: getUploadPath('logo.png'),
      cid: 'brandLogo'
    });
  }

  const addImageAttachment = (arr, product, cidPrefix) => {
    if (product?.image) {
      const fullPath = getUploadPath(cleanImagePath(product.image));
      if (fs.existsSync(fullPath)) {
        arr.push({
          filename: `${product._id}.png`,
          path: fullPath,
          cid: `${cidPrefix}-${product._id}`
        });
      }
    }
  };

  order.products?.forEach(({ product }) => addImageAttachment(orderAttachments, product, 'productImage'));
  returnRequest.products?.forEach(p => addImageAttachment(returnRequestAttachments, p, 'productImage'));
  if (productInventory?.image) addImageAttachment(productInventoryAttachments, productInventory, 'productImage');
  if (review.product?.image) addImageAttachment(reviewAttachments, review.product, 'productImage');

  return {
    orderAttachments,
    returnRequestAttachments,
    reviewAttachments,
    productInventoryAttachments
  };
};

const brandImages = {
  logo: getImageUrl('logo.png'),
};

const headerMessages = {
  pending: `Thank you for shopping with sheero!`,
  shipped: ``,
  approved: ``,
  delivered: ``,
  processed: ``,
  canceled: ``,
  rejected: ``,
};

const orderStatusMessages = {
  pending: `We have successfully received your order! <br>After we review the availability of your items, your order will be processed.</br>`,
  processed: `Your order is now in the processing stage. <br>We will try our best to fulfill your order as soon as possible!</br>`,
  shipped: `Good news! Your order has been verified and shipped. It is now on its way to you.`,
  delivered: `Your order has been successfully delivered, we hope you enjoy your purchase!`,
  canceled: `Unfortunately, your order has been canceled. If you need further assistance, please reach out to us.`,
};

const orderBodyMessages = {
  pending: `We will notify you once your order is processed.`,
  processed: `We will notify you once your order is shipped.`,
  shipped: `If there are any updates, our team will contact you.`,
  delivered: `Thank you for choosing sheero, we appreciate your trust!`,
  canceled: `If you have any questions, please contact our support team at <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline; font-weight: bold;">support@sheero.com</a>.`,
};

const returnStatusMessages = {
  pending: `We have successfully received your return request! <br>After we review the state of your items, your return request will be processed.</br>`,
  approved: `Good news! Your return request has been approved. You are eligible to return your items at our store.`,
  processed: `Your return request has been successfully processed!`,
  rejected: `Unfortunately, your return request has been rejected. If you need further assistance, please reach out to us.`,
};

const returnBodyMessages = {
  pending: `We will notify you once your return request is approved and then you will be able to return your items.`,
  approved: `If there are any updates, our team will contact you.`,
  processed: `Thank you for choosing sheero, we appreciate your trust!`,
  rejected: `If you have any questions, please contact our support team at <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline; font-weight: bold;">support@sheero.com</a>.`,
};

function getBrandHeaderHtml(brandImages = {}) {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
    </div>
  `;
};

function getEmailFooterHtml() {
  return `
    <p style="color: #666; font-size: 12px; margin-top: 20px;">
      If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
    </p>

    <p style="font-size: 14px; color: #333; margin-bottom: 12px;">
      Best regards,<br/>
      <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
    </p>

    <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: center;">
      &copy; 2025 <a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a>. All rights reserved.
    </p>
  `;
};

const loginLocation = (loginData) => ({
  country: loginData.country || 'Unknown',
  city: loginData.city || 'Unknown',
  region: loginData.region || 'Unknown'
});

const formatLoginMethod = (method) => {
  if (method === 'google') return 'Google';
  if (method === 'facebook') return 'Facebook';
  if (method === 'otp') return 'Email Code';
  if (method === 'authenticator') return 'Authenticator App';
  if (method === 'password') return 'Password';
  return method.charAt(0).toUpperCase() + method.slice(1);
};

module.exports = {
  formatDate, formatPrice, statusImages, returnStatusImages, createAttachments, brandImages, headerMessages,
  orderStatusMessages, orderBodyMessages, returnStatusMessages, returnBodyMessages, getBrandHeaderHtml,
  getEmailFooterHtml, loginLocation, formatLoginMethod
};