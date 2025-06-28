export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/,
    message: "Name must start with a capital letter and be 3-27 characters long",
    required: "Name is required"
};

export const SUBCATEGORY_VALIDATION = {
    required: "Subcategory is required"
};