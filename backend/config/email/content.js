const { parseUserAgent } = require("../auth/loginNotifications");
const { getEmailFooterHtml, getBrandHeaderHtml, formatDate, formatPrice } = require("./utils");

function generateEmailVerificationHtml(userEmail, otp, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          ${getBrandHeaderHtml(brandImages)}
  
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
            If you did not request this, you can ignore this email.
          </p>
  
          ${getEmailFooterHtml()}
      </div>
    `;
};

function generateOrderEmailHtml(order, options = {}) {
  const { brandImages, headerMessages, orderStatusMessages, orderBodyMessages, statusImages } = options;

  const formattedOrderDate = formatDate(order.createdAt);
  const formattedArrivalStart = formatDate(order.arrivalDateRange.start);
  const formattedArrivalEnd = formatDate(order.arrivalDateRange.end);

  return `
        <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- User Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${order.user.firstName}</strong>,</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${headerMessages[order.status]}</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            <strong>${orderStatusMessages[order.status]}</strong>
          </p>
  
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${orderBodyMessages[order.status]}</p>
  
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
  
          ${getEmailFooterHtml()}
          </div>
        </div>
      `;
};

function generateReturnRequestEmailHtml(returnRequest, options = {}) {
  const { brandImages, headerMessages, returnStatusMessages, returnBodyMessages, returnStatusImages } = options;

  const formattedDate = formatDate(returnRequest.createdAt);

  return `
        <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
       
          <!-- User Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${returnRequest.user.firstName}</strong>,</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${headerMessages[returnRequest.status]}</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            <strong>${returnStatusMessages[returnRequest.status]}</strong>
          </p>
  
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">${returnBodyMessages[returnRequest.status]}</p>
  
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
  
          ${getEmailFooterHtml()}
          </div>
        </div>
      `;
};

function generateReviewEmailHtml(review, options = {}) {
  const { brandImages } = options;
  const formattedDate = formatDate(review.createdAt);

  return `
        <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- User Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${review.user.firstName}</strong>,</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            <strong>Thank you for reviewing our product!</strong>
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
  
          ${getEmailFooterHtml()}
        </div>
      </div>
    `;
};

function generateProductInventoryEmailHtml(order, options = {}) {
  const { brandImages, statusImages, recipientEmail } = options;
  const productLabel = order.products.length > 1 ? "products" : "product";
  const formattedOrderDate = formatDate(order.createdAt);
  const formattedArrivalStart = formatDate(order.arrivalDateRange.start);
  const formattedArrivalEnd = formatDate(order.arrivalDateRange.end);

  return `
       <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
  
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
  
          ${getEmailFooterHtml()}
          </div>
        </div>
    `;
};

function generateResetPasswordEmailHtml(user, resetUrl, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        ${getBrandHeaderHtml(brandImages)}
  
        <!-- Greeting Section -->
        <p style="font-size: 18px; color: #333; margin-bottom: 16px;">
          Hello <strong style="color: #57534E;">${user.firstName} ${user.lastName}</strong>,
        </p>
        
        <!-- Password Reset Link -->
        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          We have received a request to reset your password for <strong style="color: #57534E;">${user.email}</strong>. If you didn't make this request, simply ignore this email.
          <br/>
          To reset your password, please <a href="${resetUrl}" style="color: #57534E; font-weight: bold; text-decoration: underline;">click here</a>.
          <br/><br/>
          <span style="color: #888; font-size: 14px;">This link will expire in 15 minutes.</span>
        </p>
  
        ${getEmailFooterHtml()}
      </div>
    `;
};

function generatePasswordResetSuccessEmailHtml(user, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
        ${getBrandHeaderHtml(brandImages)}

        <!-- Greeting Section -->
        <p style="font-size: 18px; color: #333; margin-bottom: 16px;">
          Hello <strong style="color: #57534E;">${user.firstName} ${user.lastName}</strong>,
        </p>
        
        <!-- Password Reset Success Message -->
        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-bottom: 20px;">
          Your password has been successfully updated!
          <p style="font-size: 16px;">You can now <a href="https://sheero.onrender.com/login" style="color: #57534E; text-decoration: underline;">log in</a> with your new password.</p>
        </p>
  
        ${getEmailFooterHtml()}
      </div>
    `;
};

function generateEnable2FAEmailHtml(userEmail, otp, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          ${getBrandHeaderHtml(brandImages)}

          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${userEmail}</strong>,</p>
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
            If you did not request this, you can ignore this email.
          </p>
  
          ${getEmailFooterHtml()}
      </div>
      `;
};

function generateDisable2FAEmailHtml(userEmail, otp, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          ${getBrandHeaderHtml(brandImages)}

          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${userEmail}</strong>,</p>
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
            If you did not request this, you can ignore this email.
          </p>
  
        ${getEmailFooterHtml()}
      </div>
      `;
};

function generateLogin2FAEmailHtml(userEmail, otp, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          ${getBrandHeaderHtml(brandImages)}

          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${userEmail}</strong>,</p>
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
            If you did not request this, you can ignore this email.
          </p>
  
          ${getEmailFooterHtml()}
      </div>
      `;
};

function generateProductInventoryUpdateHtml(email, product, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0 auto; border-radius: 8px; max-width: 700px;">
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- Greeting Section -->
          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${email}</strong>,</p>
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">We're thrilled to let you know that <strong>${product.name}</strong> 
          is finally back in stock! Since you've shown interest in this product, we wanted to give you a heads up so you can grab it before it's gone again.</p>
          
          <!-- Product Details Section -->
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You can view the product by clicking <a href="https://sheero.onrender.com/${product.slug}" style="color: #57534E; text-decoration: underline;"><strong>here</strong></a></p>
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
  
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
            You will no longer receive further updates for this product unless you decide to re-subscribe at a later time. Thank you for staying connected with us.
          </p>
  
          ${getEmailFooterHtml()}
      </div>
    `;
};

function generateProductRestockSubHtml(email, product, options = {}) {
  const { brandImages } = options;

  return `
      <div style="font-family: 'Outfit', sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0 auto; border-radius: 8px; max-width: 700px;">
          ${getBrandHeaderHtml(brandImages)}
          
          <!-- Greeting Section -->
          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${email}</strong>,</p>
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You've just subscribed to get notified about <strong>${product.name}</strong> 
          restock updates! As soon as the product is back in stock, we'll send you an email to let you know.</p>
  
          <!-- Product Details Section -->
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">You can view the product by clicking <a href="https://sheero.onrender.com/${product.slug}" style="color: #57534E; text-decoration: underline;"><strong>here</strong></a></p>
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
  
          ${getEmailFooterHtml()}
      </div>
    `;
};

function generateContactHtml(contact, options = {}) {
  const { brandImages } = options;
  const formattedDate = formatDate(contact.createdAt);

  return `
        <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- User Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${contact.email}</strong>,</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            <strong>Thank you for contacting us!</strong>
          </p>
          <p style="font-size: 14px; margin-bottom: 12px;">We appreciate you contacting us, we will get back to you as soon as possible!</p>
  
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
  
          ${getEmailFooterHtml()}
        </div>
      </div>
    `;
};

function generateContactToCustomerSupportHtml(contact, options = {}) {
  const { brandImages, recipientEmail } = options;
  const formattedDate = formatDate(contact.createdAt);

  return `
        <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- User Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 15px;">Hello <strong style="color: #57534E; text-decoration: underline;">${recipientEmail}</strong>,</p>
          <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">
            <strong>We have just received a new message from ${contact.email}!</strong>
          </p>
          <p style="font-size: 14px; margin-bottom: 12px;">Since you have been assigned with the role <strong>customerSupport</strong>, we would appreciate it if you could get back to them as soon as possible.</p>
  
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
  
          ${getEmailFooterHtml()}
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
          ${getBrandHeaderHtml(brandImages)}
  
          <!-- Admin/Order Manager Details -->
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">Hello <strong>${order.updatedBy.firstName} ${order.updatedBy.lastName}</strong>,</p>
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 5px;">You are receiving this email because you've been assigned with the role <strong> ${order.updatedBy.role.name}</strong> and you've successfully updated order #<strong>${order._id}</strong>.</p>
          <p style="font-size: 16px; font-weight: 500; margin-bottom: 10px;">We appreciate your help in keeping our customers informed about their orders!</p>
  
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
  
          ${getEmailFooterHtml()}
          </div>
        </div>
      `;
};

function generateLoginNotificationHtml(user, loginData, options = {}) {
  const { brandImages } = options;
  const date = new Date(loginData.timestamp).toLocaleString();
  const deviceInfo = parseUserAgent(loginData.userAgent);

  let methodDisplay = 'Password';
  switch (loginData.method) {
    case 'google': methodDisplay = 'Google Account'; break;
    case 'facebook': methodDisplay = 'Facebook Account'; break;
    case 'otp': methodDisplay = 'One-Time Password'; break;
    case 'authenticator': methodDisplay = 'Authenticator App'; break;
  }

  return `
  <div style="font-family: Outfit, sans-serif; max-width: 700px; margin: 0 auto; padding: 35px; background-color: #f5f5f5; position: relative; border-radius: 8px;">
      ${getBrandHeaderHtml(brandImages)}

      <div style="background-color: #ffffff; border-radius: 12px; padding: 20px; text-align: left; margin: 20px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px auto;">
          <p style="font-size: 18px; color: #57534E; margin-bottom: 16px;">Hello <strong>${user.firstName} ${user.lastName}</strong>,</p>
          
          <p style="font-size: 16px; color: #57534E; line-height: 1.5; margin-bottom: 20px;">
              We have detected a recent login to your sheero account with the email address <strong>${user.email}</strong>. If this was you, no action is needed.
              If this isn't you, please change your password as soon as possible.
          </p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
              <h3 style="color: #57534E; margin-top: 0; font-size: 16px;">Login Details:</h3>
              <ul style="color: #57534E; padding-left: 20px;">
                  <li><strong>Date & Time:</strong> ${date}</li>
                  <li><strong>IP Address:</strong> ${loginData.ipAddress}</li>
                  <li><strong>Location:</strong> ${loginData.location.city || 'Unknown'}, ${loginData.location.region || ''}, ${loginData.location.country || 'Unknown'}</li>
                  <li><strong>Device:</strong> ${deviceInfo}</li>
                  <li><strong>Login Method:</strong> ${methodDisplay}</li>
              </ul>
          </div>
          
        ${getEmailFooterHtml()}
      </div>
  </div>
  `;
};

module.exports = {
  generateEmailVerificationHtml, generateOrderEmailHtml, generateReturnRequestEmailHtml, generateReviewEmailHtml,
  generateProductInventoryEmailHtml, generateResetPasswordEmailHtml, generatePasswordResetSuccessEmailHtml,
  generateEnable2FAEmailHtml, generateDisable2FAEmailHtml, generateLogin2FAEmailHtml, generateProductInventoryUpdateHtml,
  generateProductRestockSubHtml, generateContactHtml, generateContactToCustomerSupportHtml, generateSuccessfulOrderUpdateHtml,
  generateLoginNotificationHtml
};