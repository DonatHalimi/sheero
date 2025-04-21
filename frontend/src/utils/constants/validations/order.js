export const statusOptions = ['pending', 'processed', 'shipped', 'delivered', 'canceled'];

export const STATUS_VALIDATION = {
    options: statusOptions,
    message: "Status options are 'pending', 'processed', 'shipped', 'delivered', 'canceled'",
    required: "Status is required"
}