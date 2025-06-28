export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,15}$/,
    message: "Name must start with a capital letter and be 2-15 characters long",
    required: "Name is required"
};

export const COUNTRY_VALIDATION = {
    required: "Country is required"
};

export const ZIP_CODE_VALIDATION = {
    regex: /^[0-9]{4,5}$/,
    message: "Zip code must be 4 or 5 digits",
    required: "Zip code is required"
};