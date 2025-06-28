import * as yup from "yup";
import { COMMENT_VALIDATION, RATING_VALIDATION, TITLE_VALIDATION } from "../constants/review";

export const initialValues = (review = null) => ({
    product: review?.product?._id || "",
    title: review?.title || "",
    rating: review?.rating || 0,
    comment: review?.comment || "",
});

export const validationSchema = yup.object().shape({
    title: yup
        .string()
        .matches(TITLE_VALIDATION.regex, TITLE_VALIDATION.message)
        .required(TITLE_VALIDATION.required),

    rating: yup
        .number()
        .min(RATING_VALIDATION.min.number, RATING_VALIDATION.min.message)
        .max(RATING_VALIDATION.max.number, RATING_VALIDATION.max.message)
        .required(RATING_VALIDATION.required),

    comment: yup
        .string()
        .matches(COMMENT_VALIDATION.regex, COMMENT_VALIDATION.message)
        .required(COMMENT_VALIDATION.required)
});