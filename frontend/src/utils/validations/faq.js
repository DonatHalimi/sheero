export const FAQValidations = {
    questionRules: {
        pattern: /^[A-Z][\s\S]{10,50}$/,
        message: "Question must start with a capital letter and be 10-50 characters long"
    },

    answerRules: {
        pattern: /^[A-Z][\s\S]{10,50}$/,
        message: "Answer must start with a capital letter and be 10-50 characters long"
    },
};