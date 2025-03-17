export const ReviewValidations = {
    titleRules: {
        pattern: /^[A-Z][\Wa-zA-Z\s]{2,40}$/,
        message: "Title must start with a capital letter and be 2-40 characters long"
    },

    commentRules: {
        pattern: /^[A-Z][\Wa-zA-Z\s]{3,500}$/,
        message: "Comment must start with a capital letter and be 3-500 characters long"
    },
};