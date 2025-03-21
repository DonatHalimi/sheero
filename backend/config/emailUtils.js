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
}

const createAttachments = (order = {}, returnRequest = {}, review = {}, productInventory = {}) => {
  const orderAttachments = [];
  const returnRequestAttachments = [];
  const reviewAttachments = [];
  const productInventoryAttachments = [];

  if (order.status && statusImages[order.status]) {
    const imageName = order.status === 'processed'
      ? 'orderProcessed.png'
      : `${order.status}.png`;

    orderAttachments.push({
      filename: imageName,
      path: path.join(__dirname, '..', 'uploads', imageName),
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

  if (productInventory && productInventory.image) {
    const imagePath = cleanImagePath(productInventory.image);
    const fullImagePath = path.join(__dirname, '..', 'uploads', imagePath);
    if (fs.existsSync(fullImagePath)) {
      productInventoryAttachments.push({
        filename: `${productInventory._id}.png`,
        path: fullImagePath,
        cid: `productImage-${productInventory._id}`
      });
    }
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
    reviewAttachments,
    productInventoryAttachments
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

function generateEmailVerificationHtml(userEmail, otp, options = {}) {
  const { brandImages } = options;

  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${userEmail}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
          Thank you for signing up with <a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: none; font-weight: bold;">sheero</a>! Your One-Time Password (OTP) is:
        </p>

        <!-- OTP Code Box -->
        <div style="border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px auto;">
            <div style="font-size: 32px; font-weight: bold; color: #57534E; letter-spacing: 8px; background-color: #ffffff; padding: 16px; border-radius: 8px; display: inline-block;">
                ${otp}
            </div>
        </div>
        <p style="font-size: 14px; color: #57534E; margin-top: 10px;">This code will expire in <strong>10 minutes</strong>.</p>

        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">
          Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
          &copy; 2025 sheero. All rights reserved.
        </p>
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

          <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
            &copy; 2025 sheero. All rights reserved.
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

        <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
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
          If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

function generateProductInventoryEmailHtml(order, options = {}) {
  const { brandImages, statusImages, recipientEmail } = options;
  const productLabel = order.products.length > 1 ? "products" : "product";
  const formattedOrderDate = formatDate(order.createdAt);
  const formattedArrivalStart = formatDate(order.arrivalDateRange.start);
  const formattedArrivalEnd = formatDate(order.arrivalDateRange.end);

  return `
     <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>

        <!-- Greeting Section -->
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 15px;">Hello <strong style="color: #57534E; text-decoration: underline;">${recipientEmail}</strong>,</p>
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 20px;">
          Below is a summary of the projected inventory for the ${productLabel} ordered by <strong style="color: #57534E; text-decoration: underline;">${order.user.email}</strong> on 
          <strong>${formattedOrderDate}</strong> with the order id #<strong style="color: #57534E; text-decoration: underline;">${order._id}</strong>.
        </p>

        <p style="font-size: 16px; font-weight: 500; margin-bottom: 20px;">
          Since you've been assigned the role <strong>orderManager</strong>, we would appreciate it if you could check the inventory for the ${productLabel} and update the status of the order accordingly.
        </p>
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 20px;">
          Please note that the inventory of the ${productLabel} will only be updated if you choose to set the order status to 
          <strong>processed</strong> in the 
          <a href="https://sheero.onrender.com/dashboard/orders" style="color: #57534E; text-decoration: underline;">
          orders dashboard
          </a>.
        </p>
            
        <!-- Inventory Update Section -->
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; text-align: center;">Inventory Update</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product ID</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Previous Inventory</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Projected Inventory</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(({ product, previousInventory, updatedInventory }) => `
                  <tr key="${product._id}">
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>${product._id}</strong>
                    </td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        ${previousInventory}
                    </td>
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                        ${updatedInventory}
                    </td>
                  </tr>`).join('')}
              </tbody>
              </table>

              <div>
                <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
                  <a href="https://sheero.onrender.com/dashboard/orders" style="color: #57534E; text-decoration: underline; font-weight: bold;">Search the above ${productLabel} in the orders dashboard</a>
                </p>
              </div>
            </div>

        <!-- Existing Order Details and Products Section -->
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 8px;">Order #${order._id} Status</p>
          <p style="font-size: 14px; color: #666; text-align: center;">Order Date: ${formattedOrderDate}</p>
          ${order.status === 'delivered'
      ? `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 6px;">Arrival Date: ${formattedArrivalStart}</p>`
      : `<p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">Arrival Date: ${formattedArrivalStart} - ${formattedArrivalEnd}</p>`
    }
          ${statusImages[order.status]
      ? `<img src="cid:statusImage" alt="${order.status}" style="width: 80%; max-width: 600px; display: block; margin: 0 auto;" />`
      : `Status: ${order.status}`
    }

          <!-- Products Table -->
          <div style="margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
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
                    <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">€ ${formatPrice(price)}</td>
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

          <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
            &copy; 2025 sheero. All rights reserved.
          </p>
        </div>
      </div>
  `;
}

function generateResetPasswordEmailHtml(user, resetUrl, options = {}) {
  const { brandImages } = options;

  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
        ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>
      <!-- Greeting Section -->
      <p style="font-size: 18px; color: #333; margin-bottom: 16px;">
        Hello <strong style="color: #57534E;">${user.email}</strong>,
      </p>
      
      <!-- Password Reset Link -->
      <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
        We have received a request to reset your password. If you didn't make this request, simply ignore this email.
        <br/>
        To reset your password, please <a href="${resetUrl}" style="color: #57534E; font-weight: bold; text-decoration: underline;">click here</a>.
        <br/><br/>
        <span style="color: #888; font-size: 14px;">This link will expire in 15 minutes.</span>
      </p>

      <!-- Footer Section -->
      <p style="font-size: 14px; color: #333; margin-bottom: 12px;">
        Best regards,<br/>
        <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: left;">
        If you have any questions, feel free to <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email</a>.
      </p>

      <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
        &copy; 2025 sheero. All rights reserved.
      </p>
    </div>
  `;
}

function generatePasswordResetSuccessEmailHtml(user) {
  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
      <!-- Greeting Section -->
      <p style="font-size: 18px; color: #333; margin-bottom: 16px;">
        Hello <strong>${user.email}</strong>,
      </p>
      
      <!-- Password Reset Success Message -->
      <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
        Your password has been successfully updated!
        <p style="font-size: 16px;">You can now <a href="https://sheero.onrender.com/login" style="color: #57534E; text-decoration: underline;">log in</a> with your new password.</p>
      </p>

      <!-- Footer Section -->
      <p style="font-size: 16px; color: #333; margin-bottom: 12px;">
        Best regards,<br/>
        <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
      </p>

      <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: left;">
        If you have any questions, feel free to <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email</a>.
      </p>

      <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
        &copy; 2025 sheero. All rights reserved.
      </p>
    </div>
  `;
}

function generateEnable2FAEmailHtml(userEmail, otp) {
  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello, <strong>${userEmail}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
          We have received a request to enable Two-Factor Authentication for your account.
          <br/>
          Your One-Time Password (OTP) is:
        </p>

        <!-- OTP Code Box -->
        <div style="border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px auto;">
            <div style="font-size: 32px; font-weight: bold; color: #57534E; letter-spacing: 8px; background-color: #ffffff; padding: 16px; border-radius: 8px; display: inline-block;">
                ${otp}
            </div>
        </div>
        <p style="font-size: 14px; color: #57534E; margin-top: 10px;">This code will expire in <strong>10 minutes</strong>.</p>

        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">
          Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
          &copy; 2025 sheero. All rights reserved.
        </p>
    </div>
    `
}

function generateDisable2FAEmailHtml(userEmail, otp) {
  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello, <strong>${userEmail}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
          We have received a request to disable Two-Factor Authentication for your account.
          <br/>
          Your One-Time Password (OTP) is:
        </p>

        <!-- OTP Code Box -->
        <div style="border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px auto;">
            <div style="font-size: 32px; font-weight: bold; color: #57534E; letter-spacing: 8px; background-color: #ffffff; padding: 16px; border-radius: 8px; display: inline-block;">
                ${otp}
            </div>
        </div>
        <p style="font-size: 14px; color: #57534E; margin-top: 10px;">This code will expire in <strong>10 minutes</strong>.</p>

        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">
          Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
          &copy; 2025 sheero. All rights reserved.
        </p>
    </div>
    `
}

function generateLogin2FAEmailHtml(userEmail, otp) {
  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello, <strong>${userEmail}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
          Since you have enabled Two-Factor Authentication, you must log in using your One-Time Password (OTP). 
          <br/>
          Your OTP is:
        </p>

        <!-- OTP Code Box -->
        <div style="border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px auto;">
            <div style="font-size: 32px; font-weight: bold; color: #57534E; letter-spacing: 8px; background-color: #ffffff; padding: 16px; border-radius: 8px; display: inline-block;">
                ${otp}
            </div>
        </div>
        <p style="font-size: 14px; color: #57534E; margin-top: 10px;">This code will expire in <strong>10 minutes</strong>.</p>

        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">
          Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: left;">
          &copy; 2025 sheero. All rights reserved.
        </p>
    </div>
    `
}

function generateProductInventoryUpdateHtml(email, product, options = {}) {
  const { brandImages } = options;

  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0 auto; border-radius: 8px; max-width: 700px;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
        ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>
        <!-- Greeting Section -->
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${email}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">We're thrilled to let you know that <strong>${product.name}</strong> 
        is finally back in stock! Since you've shown interest in this product, we wanted to give you a heads up so you can grab it before it's gone again.</p>
        
        <!-- Product Details Section -->
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You can view the product by clicking <a href="https://sheero.onrender.com/product/${product._id}" style="color: #57534E; text-decoration: underline;"><strong>here</strong></a></p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Inventory</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="cid:productImage-${product._id}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                    <div style="font-weight: 500;">${product.name}</div>
                  </div>
                </td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${product.inventoryCount}</td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">€ ${product.salePrice > 0 ? product.salePrice.toFixed(2) : product.price.toFixed(2)}</td>
              </tr>
            </tbody>
        </table>

        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You will no longer receive further updates for this product unless you decide to re-subscribe at a later time. Thank you for staying connected with us.</p>

        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong></p>

      <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: left;">
        If you have any questions, feel free to <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email</a>.
      </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
        </p>
    </div>
  `;
}

function generateProductRestockSubHtml(email, product, options = {}) {
  const { brandImages } = options;

  return `
    <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0 auto; border-radius: 8px; max-width: 700px;">
        <!-- Brand Logo -->
        <div style="display: flex; align-items: center; justify-content: space-between;">
        ${brandImages.logo
      ? `<img src="cid:brandLogo" alt="Brand Logo" style="width: 30%; max-width: 150px; display: block;" />`
      : `sheero`
    }
        </div>
        
        <!-- Greeting Section -->
        <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${email}</strong>,</p>
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You've just subscribed to get notified about <strong>${product.name}</strong> 
        restock updates! As soon as the product is back in stock, we'll send you an email to let you know.</p>

        <!-- Product Details Section -->
        <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You can view the product by clicking <a href="https://sheero.onrender.com/product/${product._id}" style="color: #57534E; text-decoration: underline;"><strong>here</strong></a></p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Inventory</th>
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">
                  <div style="display: flex; flex-direction: column; align-items: center;">
                    <img src="cid:productImage-${product._id}" alt="${product.name}" style="width: 64px; height: 64px; object-fit: contain; margin-bottom: 8px; border-radius: 4px;" />
                    <div style="font-weight: 500;">${product.name}</div>
                  </div>
                </td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">${product.inventoryCount}</td>
                <td style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd;">€ ${product.salePrice > 0 ? product.salePrice.toFixed(2) : product.price.toFixed(2)}</td>
              </tr>
            </tbody>
        </table>

        <p style="font-size: 16px; color: #57534E; margin-bottom: 12px;">Best regards,<br/><strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong></p>

        <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: left;">
          If you have any questions, feel free to <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email</a>.
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 20px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
        </p>
    </div>
  `;
}

function generateContactHtml(contact, options = {}) {
  const { brandImages } = options;
  const formattedDate = formatDate(contact.createdAt);

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
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${contact.email}</strong>,</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
          <strong>Thank you for contacting us!</strong>
        </p>
        <p style="font-size: 14px; margin-bottom: 12px;">We appreciate you contacting us, we will get back to you as soon as possible!</p>
        <p>Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 10px;">
          <p style="font-size: 18px; font-weight: 600; color: black; text-align: left;">
            Contact details
          </p>
        </div>

        <!-- Contact Details Section -->
        <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px !important; margin-top: 20px !important;">
          <div style="font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                <span>${contact.subject}</span>
            </div>
          </div>

          <div style="font-size: 14px; line-height: 1.6; color: #555; background-color: #f9f9f9; padding: 10px; border-radius: 6px; max-width: 100%;">
            ${contact.message}
          </div>
          <div style="margin-bottom: 10px;">
            <p style="font-size: 14px; color: #666; text-align: center;">
              Contact Date: ${formattedDate}
            </p>
          </div>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

function generateContactToCustomerSupportHtml(contact, options = {}) {
  const { brandImages, recipientEmail } = options;
  const formattedDate = formatDate(contact.createdAt);

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
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 15px;">Hello <strong style="color: #57534E; text-decoration: underline;">${recipientEmail}</strong>,</p>
        <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
          <strong>We have just received a new message from ${contact.email}!</strong>
        </p>
        <p style="font-size: 14px; margin-bottom: 12px;">Since you have been assigned with the role <strong>customerSupport</strong>, we would appreciate it if you could get back to them as soon as possible.</p>
        <p>Best regards,<br/>
          <strong><a href="https://sheero.onrender.com" style="color: #57534E; text-decoration: underline;">sheero</a></strong>
        </p>
        <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 10px;">
          <p style="font-size: 18px; font-weight: 600; color: black; text-align: left;">
            Contact details
          </p>
        </div>

        <!-- Contact Details Section -->
        <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px !important; margin-top: 20px !important;">
          <div style="font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 20px;">
                <span>${contact.subject}</span>
            </div>
          </div>

          <div style="font-size: 14px; line-height: 1.6; color: #555; background-color: #f9f9f9; padding: 10px; border-radius: 6px; max-width: 100%;">
            ${contact.message}
          </div>
          <div style="margin-bottom: 10px;">
            <p style="font-size: 14px; color: #666; text-align: center;">
              Contact Date: ${formattedDate}
            </p>
          </div>
        </div>

        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          If you have any questions, please <a href="https://sheero.onrender.com/contact-us" style="color: #57534E; text-decoration: underline;">contact us</a> through our contact form or through our <a href="mailto:support@sheero.com" style="color: #57534E; text-decoration: underline;">email address</a>.
        </p>

        <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
          &copy; 2025 sheero. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

function generateSuccessfulOrderUpdateHtml(order, options = {}) {
  const { brandImages, statusImages } = options;

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

        <!-- Admin/Order Manager Details -->
        <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${order.updatedBy.firstName} ${order.updatedBy.lastName}</strong>,</p>
        <p>You are receiving this email because you've been assigned with the role <strong> ${order.updatedBy.role.name}</strong> and you've successfully updated order #<strong>${order._id}</strong>.</p>
        <p>We appreciate your help in keeping our customers informed about their orders!</p>
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

          <p style="font-size: 12px; color: #888; margin-top: 40px; text-align: center;">
            &copy; 2025 sheero. All rights reserved.
          </p>
        </div>
      </div>
    `;
}

module.exports = {
  statusImages, returnStatusImages, createAttachments, brandImages, headerMessages,
  orderStatusMessages, orderBodyMessages, returnStatusMessages, returnBodyMessages,
  generateEmailVerificationHtml, generateOrderEmailHtml, generateReturnRequestEmailHtml,
  generateReviewEmailHtml, generateProductInventoryEmailHtml, generateResetPasswordEmailHtml, generatePasswordResetSuccessEmailHtml,
  generateEnable2FAEmailHtml, generateDisable2FAEmailHtml, generateLogin2FAEmailHtml, generateProductInventoryUpdateHtml, generateProductRestockSubHtml,
  generateContactHtml, generateContactToCustomerSupportHtml, generateSuccessfulOrderUpdateHtml
};