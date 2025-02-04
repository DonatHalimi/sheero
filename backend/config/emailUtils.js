const { NODE_ENV } = require("./dotenv");
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

    const fullPath = path.join(__dirname, '..', 'uploads', cleanPath);

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
  shipped: getImageUrl('shipped.png'),
  delivered: getImageUrl('delivered.png'),
  canceled: getImageUrl('canceled.png'),
};

const returnStatusImages = {
  pending: getImageUrl('returnPending.png'),
  approved: getImageUrl('approved.png'),
  processed: getImageUrl('processed.png'),
  rejected: getImageUrl('rejected.png'),
}

const createAttachments = (order = {}, returnRequest = {}, review = {}) => {
  const orderAttachments = [];
  const returnRequestAttachments = [];
  const reviewAttachments = [];

  if (order.status && statusImages[order.status]) {
    orderAttachments.push({
      filename: `${order.status}.png`,
      path: path.join(__dirname, '..', 'uploads', `${order.status}.png`),
      cid: 'statusImage'
    });
  }

  if (returnRequest.status && returnStatusImages[returnRequest.status]) {
    const imageName = returnRequest.status === 'pending'
      ? 'returnPending.png'
      : `${returnRequest.status}.png`;

    returnRequestAttachments.push({
      filename: imageName,
      path: path.join(__dirname, '..', 'uploads', imageName),
      cid: 'returnRequestImage'
    });
  }

  if (brandImages.logo) {
    orderAttachments.push({
      filename: 'logo.png',
      path: path.join(__dirname, '..', 'uploads', 'logo.png'),
      cid: 'brandLogo'
    });
  }

  if (order.products) {
    order.products.forEach(({ product }) => {
      if (product?.image) {
        const imagePath = cleanImagePath(product.image);
        const fullImagePath = path.join(__dirname, '..', 'uploads', imagePath);

        if (fs.existsSync(fullImagePath)) {
          orderAttachments.push({
            filename: `${product._id}.png`,
            path: fullImagePath,
            cid: `productImage-${product._id}`
          });
        }
      }
    });
  }

  if (returnRequest.products) {
    returnRequest.products.forEach((product) => {
      if (product?.image) {
        const imagePath = cleanImagePath(product.image);
        const fullImagePath = path.join(__dirname, '..', 'uploads', imagePath);

        if (fs.existsSync(fullImagePath)) {
          returnRequestAttachments.push({
            filename: `${product._id}.png`,
            path: fullImagePath,
            cid: `productImage-${product._id}`
          });
        }
      }
    });
  }

  if (review.product) {
    if (review.product?.image) {
      const imagePath = cleanImagePath(review.product.image);
      const fullImagePath = path.join(__dirname, '..', 'uploads', imagePath);

      if (fs.existsSync(fullImagePath)) {
        reviewAttachments.push({
          filename: `${review.product._id}.png`,
          path: fullImagePath,
          cid: `productImage-${review.product._id}`
        });
      }
    }
  }

  return {
    orderAttachments,
    returnRequestAttachments,
    reviewAttachments
  };
};

const brandImages = {
  logo: getImageUrl('logo.png'),
}

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
  shipped: `Good news! Your order has been verified and shipped. It is now on its way to you.`,
  delivered: `Your order has been successfully delivered. We hope you enjoy your purchase!`,
  canceled: `Unfortunately, your order has been canceled. If you need further assistance, please reach out to us.`,
};

const orderBodyMessages = {
  pending: `We will notify you once your order is processed.`,
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
  pending: `We will notify you once your return request is processed.`,
  approved: `If there are any updates, our team will contact you.`,
  processed: `Thank you for choosing sheero, we appreciate your trust!`,
  rejected: `If you have any questions, please contact our support team at <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline; font-weight: bold;">support@sheero.com</a>.`,
};

function generateEmailVerificationHtml(userEmail, otp) {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hello, <strong>${userEmail}</strong>,</p>
        <p>Thank you for signing up with <a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: none; font-weight: bold;">sheero</a>! Your One-Time Password (OTP) is:</p>
        <h2 style="color: #57534E;">${otp}</h2>
        <p>Please enter this code to complete your registration. It will expire in <strong>2 minutes</strong>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong></p>
    </div>
    `
}

function generateOrderEmailHtml(order, options = {}) {
  const { brandImages, headerMessages, orderStatusMessages, orderBodyMessages, statusImages } = options;

  const formattedOrderDate = formatDate(order.createdAt);
  const formattedArrivalStart = formatDate(order.arrivalDateRange.start);
  const formattedArrivalEnd = formatDate(order.arrivalDateRange.end);

  return `
      <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>

        <!-- User Details -->
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${order.user.firstName}</strong>,</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${headerMessages[order.status]}</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
          <strong>${orderStatusMessages[order.status]}</strong>
        </p>

        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${orderBodyMessages[order.status]}</p>
        <p>Best regards,<br/>
            <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>

        <!-- Order Details Section -->
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 20px;">
            <p style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 8px;">
              Order #${order._id} Status
            </p>
            <p style="font-size: 14px; color: #666; text-align: center;">
              Order Date: ${formattedOrderDate}
            </p>
            ${order.status === 'delivered'
      ? `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 6px;">
                    Arrival Date: ${formattedArrivalStart}
                  </p>`
      : `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                    Arrival Date: ${formattedArrivalStart} - ${formattedArrivalEnd}
                  </p>`
    }
            ${statusImages[order.status]
      ? `<img src="cid:statusImage" alt="${order.status}" style="width: 80%; max-width: 600px; display: block; margin: 0 auto;" />`
      : `Status: ${order.status}`
    }
            <div>
              <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                <a href="https://sheero.onrender.com/profile/orders/${order._id}" style="color: #57534E; text-decoration: underline; font-weight: bold;">Order status</a>
              </p>
            </div>
          </div>

          <!-- Products Section -->
          <div style="margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${order.products.length > 1 ? 'Products' : 'Product'}
                  </th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(({ product, quantity, price }) => `
                  <tr key="${product._id}">
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                      <div style="display: flex; align-items: center;">
                        <img src="cid:productImage-${product._id}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: contain; margin-right: 8px; border-radius: 4px;" />
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

          <!-- Total Amount Section -->
        <div style="margin-bottom: 20px;">
          <div>
            <p style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Total Amount</p>
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
        </div>

        <div style="border-bottom: 1px solid #e0e0e0; width: 100%; margin: auto; margin-top: 14px;"></div>

          <!-- Shipping Address Section -->
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

        <div style="border-bottom: 1px solid #e0e0e0; width: 100%; margin: auto; margin-top: 14px;"></div>

            <!-- Payment Information Section -->
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
                      ${order.paymentMethod === 'stripe' && order.paymentStatus === 'succeeded'
      ? 'Successful'
      : (order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A')
    }
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
}

function generateReturnRequestEmailHtml(returnRequest, options = {}) {
  const { brandImages, headerMessages, returnStatusMessages, returnBodyMessages, returnStatusImages } = options;

  const formattedDate = formatDate(returnRequest.createdAt);

  return `
      <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>
     
        <!-- User Details -->
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${returnRequest.user.firstName}</strong>,</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${headerMessages[returnRequest.status]}</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
          <strong>${returnStatusMessages[returnRequest.status]}</strong>
        </p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${returnBodyMessages[returnRequest.status]}</p>
        <p>Best regards,<br/>
        <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 10px;">
            <p style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 8px;">
              Return Request #${returnRequest._id} Status
            </p>
            <p style="font-size: 14px; color: #666; text-align: center;">
              Return Request Date: ${formattedDate}
            </p>
          </div>
  
          <!-- Return Request Status Section -->
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 4px rgba(0,0,0,0.1);">
            ${returnStatusImages[returnRequest.status]
      ? `<img src="cid:returnRequestImage" alt="${returnRequest.status}" style="width: 80%; max-width: 600px; display: block; margin: 0 auto;" />`
      : `Status: ${returnRequest.status}`
    }
            <div>
              <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                <a href="https://sheero.onrender.com/profile/returns/${returnRequest._id}" style="color: #57534E; text-decoration: underline; font-weight: bold;">Return Request status</a>
              </p>
            </div>
          </div>
  
          <!-- Product Details Section -->
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                  ${returnRequest.products.length > 1 ? 'Products' : 'Product'}
                </th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Reason</th>
              </tr>
            </thead>
            <tbody>
              ${returnRequest?.products?.map(({ _id, name }) => `
                <tr key="${_id}">
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                      <img src="cid:productImage-${_id}" alt="${name}" style="width: 64px; height: 64px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                      <div style="font-weight: 500;">${name}</div>
                    </div>
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${returnRequest?.reason}
                    ${returnRequest?.reason === 'Other'
        ? `<p style="font-size: 14px;">Custom Reason: ${returnRequest?.customReason}</p>`
        : ''} 
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
          </p>
        </div>
      </div>
    `;
}

function generateReviewEmailHtml(review, options = {}) {
  const { brandImages } = options;
  const formattedDate = formatDate(review.createdAt);

  return `
      <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
        ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>

        <!-- User Details -->
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${review.user.firstName}</strong>,</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
          <strong>Thank you for reviewing our product!</strong>
        </p>
        <p>Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 10px;">
            <p style="font-size: 14px; color: #666; text-align: center;">
              Review Date: ${formattedDate}
            </p>
          </div>

          <!-- Product Details Section -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="cid:productImage-${review.product._id}" alt="${review.product.name}" style="width: 64px; height: 64px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                    <div style="font-weight: 500;">${review.product.name}</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        <!-- Review Details Section -->
        <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px !important; margin-top: 20px !important;">
          <div style="font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                <span>${review.title}</span>
              <div style="color: #59504b; display: flex !important; gap: 15px !important; margin-left: 15px !important; font-size: 20px !important;">
                ${Array.from({ length: 5 }, (_, i) => i < review.rating ? '★' : '☆').join('')}
              </div>
            </div>
          </div>

          <div style="font-size: 14px; line-height: 1.6; color: #555; background-color: #f9f9f9; padding: 10px; border-radius: 6px; max-width: 100%;">
            ${review.comment}
          </div>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
        </p>
      </div>
    </div>
  `;
}

module.exports = {
  statusImages, returnStatusImages, createAttachments, brandImages, headerMessages,
  orderStatusMessages, orderBodyMessages, returnStatusMessages, returnBodyMessages,
  generateEmailVerificationHtml, generateOrderEmailHtml, generateReturnRequestEmailHtml, generateReviewEmailHtml
};