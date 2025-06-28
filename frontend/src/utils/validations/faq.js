import * as yup from "yup";
import { ANSWER_VALIDATION, QUESTION_VALIDATION } from "../constants/faq";

export const initialValues = (faq = null) => ({
    question: faq?.question || "",
    answer: faq?.answer || "",
});

export const validationSchema = yup.object().shape({
    question: yup
        .string()
        .matches(QUESTION_VALIDATION.regex, QUESTION_VALIDATION.message)
        .required(QUESTION_VALIDATION.required),

    answer: yup
        .string()
        .matches(ANSWER_VALIDATION.regex, ANSWER_VALIDATION.message)
        .required(ANSWER_VALIDATION.required)
});