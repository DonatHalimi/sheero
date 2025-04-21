export const QUESTION_VALIDATION = {
    regex: /^[A-Z][\s\S]{10,50}$/,
    message: "Question must start with a capital letter and be 10-50 characters long",
    required: "Question is required"
};

export const ANSWER_VALIDATION = {
    regex: /^[A-Z][\s\S]{10,50}$/,
    message: "Answer must start with a capital letter and be 10-50 characters long",
    required: "Answer is required"
};