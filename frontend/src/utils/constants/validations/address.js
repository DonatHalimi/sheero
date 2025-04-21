export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,10}$/,
    title: 'Invalid Name',
    message: "Name must start with a capital letter and be 2-10 characters long",
    required: "Name is required"
};

export const STREET_VALIDATION = {
    regex: /^[A-Z][a-zA-Z0-9\s]{2,27}$/,
    title: 'Invalid Street',
    message: "Street must start with a capital letter and be 2-27 characters",
    required: "Street is required"
};

export const PHONE_NUMBER_VALIDATION = {
    regex: /^0(43|44|45|46|47|48|49)\d{6}$/,
    title: 'Invalid Phone Number',
    message: "Phone number start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits",
    required: "Phone number is required"
};

export const COMMENT_VALIDATION = {
    regex: /^[a-zA-Z0-9\s]{2,25}$/,
    title: 'Invalid Comment',
    message: "Comment must be 2-25 characters when provided"
};

export const CITY_VALIDATION = {
    required: "City is required"
};

export const COUNTRY_VALIDATION = {
    required: "Country is required"
};