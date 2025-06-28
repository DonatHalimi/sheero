import * as yup from "yup";
import { EMAIL_VALIDATION, MESSAGE_VALIDATION, NAME_VALIDATION, SUBJECT_VALIDATION } from "../constants/contact";

export const initialValues = (contact = null) => ({
    name: contact?.name || "",
    email: contact?.email || "",
    subject: contact?.subject || "",
    message: contact?.message || "",
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    email: yup
        .string()
        .email(EMAIL_VALIDATION.message)
        .matches(EMAIL_VALIDATION.regex, EMAIL_VALIDATION.message)
        .required(EMAIL_VALIDATION.required),

    subject: yup
        .string()
        .matches(SUBJECT_VALIDATION.regex, SUBJECT_VALIDATION.message)
        .required(SUBJECT_VALIDATION.required),

    message: yup
        .string()
        .matches(MESSAGE_VALIDATION.regex, MESSAGE_VALIDATION.message)
        .required(MESSAGE_VALIDATION.required)
});