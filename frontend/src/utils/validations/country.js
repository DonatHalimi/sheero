export const CountryValidations = {
    nameRules: {
        pattern: /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,35}$/,
        message: "Name must start with a capital letter and be 3-35 characters long"
    },

    countryCodeRules: {
        pattern: /^[A-Z]{2,3}$/,
        message: "Country code must be capitalized and 2-3 capital letters"
    },
};