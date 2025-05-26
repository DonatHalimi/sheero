const Queue = require('bull');
const { REDIS_URL } = require('../core/dotenv');
const { sendOrderUpdateEmail, sendProductInventoryUpdateEmail, sendReturnRequestUpdateEmail, sendReviewEmail, sendContactEmail, sendContactEmailToCustomerSupport } = require('./service');

const createQueue = (name, processor) => {
    const queue = new Queue(name, REDIS_URL, {
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: true,
        },
    });
    queue.process(processor);
    return queue;
};

const orderEmailQueue = createQueue('order-email-queue', async job => {
    const { order } = job.data;
    await sendOrderUpdateEmail(order);
    if (order.status === 'pending') {
        await sendProductInventoryUpdateEmail(order);
    }
});

const returnEmailQueue = createQueue('return-email-queue', async job => {
    const { returnRequest } = job.data;
    await sendReturnRequestUpdateEmail(returnRequest);
});

const reviewEmailQueue = createQueue('review-email-queue', async job => {
    const { review } = job.data;
    await sendReviewEmail(review);
});

const contactEmailQueue = createQueue('contact-email-queue', async job => {
    const { contact } = job.data;
    await sendContactEmail(contact);
    await sendContactEmailToCustomerSupport(contact);
});

module.exports = { orderEmailQueue, returnEmailQueue, reviewEmailQueue, contactEmailQueue };