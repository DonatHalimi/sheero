export const CityValidations = {
    nameRules: {
        pattern: /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,15}$/,
        message: "Name must start with a capital letter and be 2-15 characters long"
    },

    zipCodeRules: {
        pattern: /^[0-9]{4,5}$/,
        message: "Zip code must be 4-5 digits long"
    }
};