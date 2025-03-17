export const RoleValidations = {
    nameRules: {
        pattern: /^[\Wa-zA-Z\s]{2,40}$/,
        message: "Name must contain at least 3 characters"
    },

    descriptionRules: {
        pattern: /^[A-Z][\Wa-zA-Z\s]{3,500}$/,
        message: "Description must start with a capital letter and be 3-500 characters long"
    },
};