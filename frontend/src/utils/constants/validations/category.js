export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,28}$/,
    title: 'Invalid Name',
    message: "Name must start with a capital letter and be 3-28 characters long",
    required: "Name is required"
};

export const IMAGE_VALIDATION = {
    required: "Image is required"
};