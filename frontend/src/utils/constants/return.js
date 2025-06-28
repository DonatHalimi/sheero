export const reasons = [
    'Damaged Item',
    'Wrong Item Delivered',
    'Item Not as Described',
    'Changed My Mind',
    'Other',
];

export const statusOptions = ['pending', 'approved', 'processed', 'rejected'];

export const STATUS_VALIDATION = {
    options: statusOptions,
    message: "Status options are 'pending', 'approved', 'processed', 'rejected'",
    required: "Status is required"
};

export const SELECTED_PRODUCTS_VALIDATION = {
    message: "Please select at least one product",
    required: "Product selection is required"
};

export const REASON_VALIDATION = {
    options: reasons,
    message: "Reason options are 'Damaged Item', 'Wrong Item Delivered', 'Item Not as Described', 'Changed My Mind', 'Other'",
    required: "Reason for return is required"
};

export const CUSTOM_REASON_VALIDATION = {
    regex: /^[A-Z][a-zA-Z\s]{5,20}$/,
    message: "Must start with a capital letter and be 5 to 20 characters long",
    required: "Please specify a reason"
};

export const CHECKBOX_VALIDATION = {
    message: "You must confirm your selection",
    required: "Confirmation is required"
};