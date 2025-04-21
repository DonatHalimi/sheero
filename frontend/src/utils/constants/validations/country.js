export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,35}$/,
    message: "Name must start with a capital letter and be 3-35 characters long",
    required: "Name is required"
};

export const COUNTRY_CODE_VALIDATION = {
    regex: /^[A-Z]{2,3}$/,
    message: "Country code must be capitalized and 2-3 characters long",
    required: "Country code is required"
};