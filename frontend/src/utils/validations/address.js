export const AddressValidations = {
    nameRules: {
        pattern: /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,15}$/,
        title: 'Invalid Name',
        message: "Name must start with a capital letter and be 2-15 characters long"
    },

    streetRules: {
        pattern: /^[A-Z][a-zA-Z0-9\s]{2,27}$/,
        title: 'Invalid Street',
        message: "Street must start with a capital letter and be 2-27 characters"
    },

    phoneRules: {
        pattern: /^0(43|44|45|46|47|48|49)\d{6}$/,
        title: 'Invalid Phone Number',
        message: "Phone number start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits"
    },

    commentRules: {
        pattern: /^[a-zA-Z0-9\s]{2,25}$/,
        title: 'Invalid Comment',
        message: "Comment must be 2-25 characters when provided"
    }
};