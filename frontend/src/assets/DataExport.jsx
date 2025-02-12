import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const createDownloadLink = (data, fileName) => {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(data)}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const formatDownloadDate = (date) =>
    `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

export const generateOrderPDF = async (order) => {
    if (!order) return;

    const doc = new jsPDF();

    const pagePadding = 10;
    const lineSpacing = 7;

    // Header
    const pageWidth = doc.internal.pageSize.width;
    const headerStartY = 15;
    doc.setFillColor(87, 83, 78);
    doc.rect(pagePadding, headerStartY, pageWidth - pagePadding * 2, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("sheero", pagePadding + 5, headerStartY + 13);

    doc.setFontSize(12);
    const orderText = `Order #${order._id}`;
    const orderTextWidth = doc.getStringUnitWidth(orderText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(orderText, pageWidth - pagePadding - orderTextWidth - 5, headerStartY + 13);

    // Company Info
    const companyStartY = headerStartY + 30;
    const valueOffset = 65;
    const drawCompanyLine = (label, value, yPosition) => {
        doc.text(`${label}:`, pagePadding, yPosition);
        doc.text(value || 'N/A', pagePadding + valueOffset, yPosition);
    };

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("sheero KS", pagePadding, companyStartY);
    doc.text("Vëllezërit Gërvalla 201 - Ferizaj, Kosovë", pagePadding, companyStartY + lineSpacing);

    const blankSpace = companyStartY + lineSpacing * 3;

    // Draw other company info with the adjusted Y position
    drawCompanyLine("Phone", '044221112', blankSpace);
    drawCompanyLine("Email", 'support@sheero.com', blankSpace + lineSpacing);
    drawCompanyLine("Website", 'www.sheero.onrender.com', blankSpace + lineSpacing * 2);

    // Order Info      
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date)
            .toLocaleDateString('en-GB', options)
            .replace(/^(.*?)(\s\d)/, '$1,$2');
    };
    const paymentInfo = () => order.paymentMethod === 'stripe' ? 'Stripe Payment' : 'Cash on delivery';

    const rightColumnX = pageWidth - pagePadding - 70;
    doc.text(`Order date: ${formatDate(order.createdAt)}`, rightColumnX, companyStartY);
    doc.text(`Payment: ${paymentInfo()}`, rightColumnX, companyStartY + lineSpacing);

    // Shipping Address
    const dividerY = companyStartY + lineSpacing * 6 - 1;
    doc.setLineWidth(0.2);
    doc.setDrawColor(224, 224, 224);
    doc.line(pagePadding, dividerY, pageWidth - pagePadding, dividerY);

    const addressStartY = dividerY + 8;
    var tableStartY = addressStartY + lineSpacing * 6;
    const drawAddressLine = (label, value, yPosition) => {
        doc.text(`${label}:`, pagePadding, yPosition);
        doc.text(value || 'N/A', pagePadding + valueOffset, yPosition);
    };
    drawAddressLine("Name", order.address?.name, addressStartY);
    drawAddressLine("Street", order.address?.street, addressStartY + lineSpacing);
    drawAddressLine("City", order.address?.city?.name, addressStartY + lineSpacing * 2);
    drawAddressLine("Country", order.address?.country?.name, addressStartY + lineSpacing * 3);
    drawAddressLine("Phone", order.address?.phoneNumber, addressStartY + lineSpacing * 4);

    if (order.address?.comment) {
        drawAddressLine("Comment", order.address?.comment, addressStartY + lineSpacing * 5);
        tableStartY = addressStartY + lineSpacing * 6;
    } else {
        tableStartY = addressStartY + lineSpacing * 5;
    }

    doc.autoTable({
        head: [['Product', 'Quantity', 'Price', 'Subtotal']],
        body: order.products.map(({ product, quantity, price, discount = 0 }) => [
            product.name,
            quantity,
            `€${price.toFixed(2)}`,
            `€${(quantity * price - discount).toFixed(2)}`
        ]),
        startY: tableStartY,
        theme: 'grid',
        headStyles: {
            fillColor: [87, 83, 78],
            textColor: [255, 255, 255],
            fontSize: 10
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        margin: { left: pagePadding, right: pagePadding }
    });

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalsLabelX = pageWidth - pagePadding - 70;
    const totalsValueX = pageWidth - pagePadding - 20;

    doc.text("Subtotal:", totalsLabelX, finalY);
    const subtotal = order.products.reduce((total, { price, quantity }) => total + price * quantity, 0);
    doc.text(`€${subtotal.toFixed(2)}`, totalsValueX, finalY);

    doc.text("Transport:", totalsLabelX, finalY + lineSpacing);
    doc.text(`€${order.shipping?.toFixed(2) || '2.00'}`, totalsValueX, finalY + lineSpacing);

    // Totals Divider Line
    doc.setDrawColor(224, 224, 224);
    doc.line(pagePadding + 120, finalY + lineSpacing * 2, pageWidth - pagePadding, finalY + lineSpacing * 2);

    doc.text("Total:", totalsLabelX, finalY + lineSpacing * 3);
    doc.text(`€${order.totalAmount?.toFixed(2) || '0.00'}`, totalsValueX, finalY + lineSpacing * 3);

    // Save PDF
    doc.save(`order_${order._id}.pdf`);
};

export const downloadUserData = (user) => {
    if (!user) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${user.firstName}_${user.lastName}_PersonalData_${date}.json`;
    const data = JSON.stringify(user, null, 2);

    createDownloadLink(data, fileName);
};

export const generateReturnPDF = (returnRequest) => {
    if (!returnRequest || !returnRequest.products) return;

    const doc = new jsPDF();

    const pagePadding = 10;
    const lineSpacing = 7;

    // Header
    const pageWidth = doc.internal.pageSize.width;
    const headerStartY = 15;
    doc.setFillColor(87, 83, 78);
    doc.rect(pagePadding, headerStartY, pageWidth - pagePadding * 2, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("sheero", pagePadding + 5, headerStartY + 13);

    doc.setFontSize(12);
    const returnText = `Return #${returnRequest._id}`;
    const returnTextWidth = doc.getStringUnitWidth(returnText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(returnText, pageWidth - pagePadding - returnTextWidth - 5, headerStartY + 13);

    // Company Info
    const companyStartY = headerStartY + 30;
    const valueOffset = 65;
    const drawCompanyLine = (label, value, yPosition) => {
        doc.text(`${label}:`, pagePadding, yPosition);
        doc.text(value || 'N/A', pagePadding + valueOffset, yPosition);
    };

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text("sheero KS", pagePadding, companyStartY);
    doc.text("Vëllezërit Gërvalla 201 - Ferizaj, Kosovë", pagePadding, companyStartY + lineSpacing);

    const blankSpace = companyStartY + lineSpacing * 3;

    // Draw other company info with the adjusted Y position
    drawCompanyLine("Phone", '044221112', blankSpace);
    drawCompanyLine("Email", 'support@sheero.com', blankSpace + lineSpacing);
    drawCompanyLine("Website", 'www.sheero.onrender.com', blankSpace + lineSpacing * 2);

    // Divider line after company info
    const dividerY = blankSpace + lineSpacing * 4 - 4;
    doc.setLineWidth(0.2);
    doc.setDrawColor(224, 224, 224);
    doc.line(pagePadding, dividerY, pageWidth - pagePadding, dividerY);

    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date)
            .toLocaleDateString('en-GB', options)
            .replace(/^(.*?)(\s\d)/, '$1,$2');
    };

    const rightColumnX = pageWidth - pagePadding - 70;
    doc.text(`Return date: ${formatDate(returnRequest.createdAt)}`, rightColumnX, companyStartY);
    doc.text(`Return reason: ${returnRequest.reason}`, rightColumnX, companyStartY + lineSpacing);

    // Reason Info
    if (returnRequest.reason === 'Other' && returnRequest.customReason) {
        const rightColumnX = pageWidth - pagePadding - 70;
        doc.text(`Custom Reason: ${returnRequest.customReason}`, rightColumnX, companyStartY + lineSpacing * 2);
    }

    const tableStartY = blankSpace + lineSpacing * 5;

    const tableBody = returnRequest.products.map((product) => [
        product.name || 'Unknown',
        '1'
    ]);

    doc.autoTable({
        head: [['Product', 'Quantity']],
        body: tableBody,
        startY: tableStartY,
        theme: 'grid',
        headStyles: {
            fillColor: [87, 83, 78],
            textColor: [255, 255, 255],
            fontSize: 10
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        margin: { left: pagePadding, right: pagePadding }
    });

    // Save PDF
    doc.save(`return_${returnRequest._id}.pdf`);
};

export const downloadAddress = (address) => {
    if (!address) return;

    const date = formatDownloadDate(new Date());
    const fileName = `Address_${address.name}_${date}.json`;
    const data = JSON.stringify(address, null, 2);

    createDownloadLink(data, fileName);
};

export const downloadAddressData = (address) => {
    if (!address) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${address.user.firstName}_${address.user.lastName}_AddressDetails_${date}.json`;

    const data = {
        user: {
            id: address.user._id,
            firstName: address.user.firstName,
            lastName: address.user.lastName,
            email: address.user.email
        },
        address: {
            id: address._id,
            name: address.name,
            street: address.street,
            country: {
                id: address.country._id,
                countryCode: address.country.countryCode,
                name: address.country.name,
            },
            city: {
                id: address.city._id,
                name: address.city.name,
                zipCode: address.city.zipCode
            },
            phoneNumber: address.phoneNumber,
            comment: address.comment || 'N/A',
            createdAt: address.createdAt,
            updatedAt: address.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadCategoryData = (category) => {
    if (!category) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${category.name}_Details_${date}.json`;

    const data = {
        category: {
            id: category._id,
            name: category.name,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadCityData = (city) => {
    if (!city) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${city.name}_Details_${date}.json`;

    const data = {
        city: {
            id: city._id,
            name: city.name,
            zipCode: city.zipCode,
            country: {
                countryCode: city.country.countryCode,
                name: city.country.name
            },
            createdAt: city.createdAt,
            updatedAt: city.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadContactData = (contact) => {
    if (!contact) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${contact.name}_Details_${date}.json`;

    const data = {
        contact: {
            id: contact._id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            message: contact.message,
            user: {
                id: contact.userId ? contact.userId._id : 'N/A',
                firstName: contact.userId ? contact.userId.firstName : 'N/A',
                lastName: contact.userId ? contact.userId.lastName : 'N/A',
                email: contact.userId ? contact.userId.email : 'N/A',
                googleId: contact.userId?.googleId || 'N/A',
                facebookId: contact.userId?.facebookId || 'N/A',
            },
            createdAt: contact.createdAt,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadCountryData = (country) => {
    if (!country) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${country.name}_Details_${date}.json`;

    const data = {
        country: {
            id: country._id,
            countryCode: country.countryCode,
            name: country.name,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadFaqData = (faq) => {
    if (!faq) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${faq.question}_Details_${date}.json`;

    const data = {
        faq: {
            id: faq._id,
            question: faq.question,
            answer: faq.answer,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadOrderData = (order) => {
    if (!order) return;

    const date = formatDownloadDate(new Date());
    const fileName = `Order #${order.id}_Details_${date}.json`;

    const data = {
        order: {
            id: order._id,
            user: {
                id: order.user._id,
                firstName: order.user.firstName,
                lastName: order.user.lastName,
                email: order.user.email
            },
            address: {
                id: order.address._id,
                name: order.address.name,
                street: order.address.street,
                country: {
                    countryCode: order.address.country.countryCode,
                    name: order.address.country.name
                },
                city: {
                    name: order.address.city.name,
                    zipCode: order.address.city.zipCode
                },
                phoneNumber: order.address.phoneNumber,
                comment: order.address.comment || 'N/A'
            },
            products: order.products.map(product => ({
                name: product.product?.name || 'Unknown Product',
                quantity: product.quantity || 0
            })),
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            paymentIntentId: order.paymentIntentId || 'N/A',
            status: order.status,
            arrivalDateRange: {
                start: order.arrivalDateRange.start,
                end: order.arrivalDateRange.end
            },
            createdAt: order.createdAt,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadProductData = (product) => {
    if (!product) return;

    const truncateItems = (items, maxItems = 3) => {
        if (!items || items.length === 0) return null;
        if (items.length <= maxItems) {
            return items;
        }
        return [...items.slice(0, maxItems), '...'];
    };

    const formatDimensions = (dimensions) => {
        if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height || !dimensions.unit) {
            return null;
        }
        return `${dimensions.length} x ${dimensions.width} x ${dimensions.height} ${dimensions.unit}`;
    };

    const formatShipping = (shipping) => {
        if (!shipping) return null;
        return {
            weight: shipping.weight || null,
            dimensions: formatDimensions(shipping.dimensions) || null,
            cost: shipping.cost || null,
            packageSize: shipping.packageSize || null,
        };
    };

    const formatSupplier = (supplier) => {
        if (!supplier) return null;
        return {
            name: supplier.name || null,
            contactInfo: {
                email: supplier.contactInfo?.email || null,
                phoneNumber: supplier.contactInfo?.phoneNumber || null,
            },
        };
    };

    const date = formatDownloadDate(new Date());
    const fileName = `${product.name}_Details_${date}.json`;

    const data = {
        product: {
            name: product.name || null,
            description: product.description || null,
            details: truncateItems(product.details?.map(detail => `${detail.attribute}: ${detail.value}`)) || null,
            price: product.price || null,
            salePrice: product.salePrice || null,
            discount: product.discount ? {
                type: product.discount.type || null,
                value: product.discount.value || null,
            } : null,
            category: product.category?.name || null,
            subcategory: product.subcategory?.name || null,
            subSubcategory: product.subSubcategory?.name || null,
            image: product.image || null,
            inventoryCount: product.inventoryCount || null,
            dimensions: formatDimensions(product.dimensions) || null,
            variants: truncateItems(product.variants?.map(variant => ({
                color: variant.color || null,
                size: variant.size || null,
            }))) || null,
            supplier: formatSupplier(product.supplier) || null,
            shipping: formatShipping(product.shipping) || null,
        },
        exportDate: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadReturnRequestData = (returnRequest) => {
    if (!returnRequest) return;

    const date = formatDownloadDate(new Date());
    const fileName = `Return Request #${returnRequest._id}_Details_${date}.json`;

    const data = {
        returnRequest: {
            id: returnRequest._id,
            user: {
                id: returnRequest.user._id,
                firstName: returnRequest.user.firstName,
                lastName: returnRequest.user.lastName,
                email: returnRequest.user.email
            },
            order: returnRequest.order,
            products: returnRequest.products,
            reason: returnRequest.reason,
            customReason: returnRequest.customReason || 'N/A',
            status: returnRequest.status,
            createdAt: returnRequest.createdAt,
            updatedAt: returnRequest.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadReviewData = (review) => {
    if (!review) return;

    const date = formatDownloadDate(new Date());
    const fileName = `Review #${review._id}_Details_${date}.json`;

    const data = {
        review: {
            id: review._id,
            user: {
                id: review.user._id,
                firstName: review.user.firstName,
                lastName: review.user.lastName,
                email: review.user.email
            },
            product: {
                id: review.product._id,
                name: review.product.name
            },
            title: review.title,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadRoleData = (role) => {
    if (!role) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${role.name}_Details_${date}.json`;

    const data = {
        role: {
            id: role._id,
            name: role.name,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadImageData = (image) => {
    if (!image) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${image.title}_Details_${date}.json`;

    const data = {
        image: {
            id: image._id,
            image: image.image,
            title: image.title,
            description: image.description,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
};

export const downloadSubcategoryData = (subcategory) => {
    if (!subcategory) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${subcategory.name}_Details_${date}.json`;

    const data = {
        subcategory: {
            id: subcategory._id,
            name: subcategory.name,
            image: subcategory.image,
            category: subcategory.category.name,
            createdAt: subcategory.createdAt,
            updatedAt: subcategory.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
}

export const downloadSubSubcategoryData = (subSubcategory) => {
    if (!subSubcategory) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${subSubcategory.name}_Details_${date}.json`;

    const data = {
        subSubcategory: {
            id: subSubcategory._id,
            name: subSubcategory.name,
            subcategory: subSubcategory.subcategory.name,
            createdAt: subSubcategory.createdAt,
            updatedAt: subSubcategory.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
}

export const downloadSupplierData = (supplier) => {
    if (!supplier) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${supplier.name}_Details_${date}.json`

    const data = {
        supplier: {
            id: supplier._id,
            name: supplier.name,
            contactInfo: {
                email: supplier.contactInfo.email,
                phoneNumber: supplier.contactInfo.phoneNumber,
            },
            createdAt: supplier.createdAt,
            updatedAt: supplier.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
}

export const downloadUserDetails = (user) => {
    if (!user) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${user.firstName}_${user.lastName}_Details_${date}.json`

    const data = {
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
            profilePicture: user.profilePicture,
            googleId: user.googleId || 'N/A',
            facebookId: user.facebookId || 'N/A',
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
}

export const downloadSubscriptionData = (subscription) => {
    if (!subscription) return;

    const date = formatDownloadDate(new Date());
    const fileName = `${subscription.productId.name}_Restock_Details_${date}.json`

    const data = {
        subscription: {
            id: subscription._id,
            name: subscription.name,
            email: subscription.email,
            productId: {
                id: subscription.productId._id,
                name: subscription.productId.name,
                image: subscription.productId.image,
                inventoryCount: subscription.productId.inventoryCount,
            },
            createdAt: subscription.createdAt,
        },
        exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    createDownloadLink(json, fileName);
}

export const exportToExcel = (data, fileName = 'exported_data') => {
    const date = formatDownloadDate(new Date());

    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-adjust column widths based on content length
    const columnWidths = Object.keys(data[0] || {}).map((key) =>
        Math.max(
            key.length,
            ...data.map((row) => (row[key] ? row[key].toString().length : 0))
        )
    );

    ws['!cols'] = columnWidths.map((width) => ({ wch: width + 2 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}_${date}.xlsx`);
};

export const exportToJSON = (data, fileName = 'exported_data') => {
    const date = formatDownloadDate(new Date());

    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(jsonBlob);
    link.download = `${fileName}_${date}.json`;
    link.click();
};