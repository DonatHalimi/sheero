export const TITLE_VALIDATION = {
    regex: /^[A-Z][\Wa-zA-Z\s]{2,40}$/,
    title: 'Invalid Title',
    message: "Title must start with a capital letter and be 2-40 characters long",
    required: "Title is required"
};

export const RATING_VALIDATION = {
    min: {
        number: 1,
        message: "Rating must be at least 1"
    },
    max: {
        number: 5,
        message: "Rating must be at most 5"
    },
    required: "Rating is required"
};

export const COMMENT_VALIDATION = {
    regex: /^[A-Z][\Wa-zA-Z\s]{3,500}$/,
    title: 'Invalid Comment',
    message: "Comment must start with a capital letter and be 3-500 characters long",
    required: "Comment is required"
};