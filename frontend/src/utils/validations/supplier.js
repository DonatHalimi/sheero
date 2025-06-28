import * as yup from "yup";
import { EMAIL_VALIDATION, NAME_VALIDATION, PHONE_NUMBER_VALIDATION } from "../constants/supplier";

export const initialValues = (supplier = null) => ({
    name: supplier?.name || "",
    email: supplier?.contactInfo.email || "",
    phoneNumber: supplier?.contactInfo.phoneNumber || "",
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

    phoneNumber: yup
        .string()
        .matches(PHONE_NUMBER_VALIDATION.regex, PHONE_NUMBER_VALIDATION.message)
        .required(PHONE_NUMBER_VALIDATION.required),
});