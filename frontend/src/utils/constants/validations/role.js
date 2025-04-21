export const NAME_VALIDATION = {
    regex: /[\Wa-zA-Z\s]{2,40}$/,
    message: "Name must be 2-40 characters long",
    required: "Name is required"
};

export const DESCRIPTION_VALIDATION = {
    regex: /^[A-Z][\Wa-zA-Z\s]{3,500}$/,
    message: "Description must start with a capital letter and be 3-500 characters long",
    required: "Description is required"
};