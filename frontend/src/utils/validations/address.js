import * as yup from "yup";
import { CITY_VALIDATION, COMMENT_VALIDATION, COUNTRY_VALIDATION, NAME_VALIDATION, PHONE_NUMBER_VALIDATION, STREET_VALIDATION } from "../constants/validations/address";

export const initialValues = (address = null) => ({
    name: address?.name || "",
    street: address?.street || "",
    phoneNumber: address?.phoneNumber || "",
    comment: address?.comment || "",
    country: address?.country || null,
    city: address?.city || null
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    street: yup
        .string()
        .matches(STREET_VALIDATION.regex, STREET_VALIDATION.message)
        .required(STREET_VALIDATION.required),

    phoneNumber: yup
        .string()
        .matches(PHONE_NUMBER_VALIDATION.regex, PHONE_NUMBER_VALIDATION.message)
        .required(PHONE_NUMBER_VALIDATION.required),

    comment: yup
        .string()
        .nullable(true)
        .matches(COMMENT_VALIDATION.regex, COMMENT_VALIDATION.message),

    country: yup
        .object()
        .required(COUNTRY_VALIDATION.required),

    city: yup
        .object()
        .required(CITY_VALIDATION.required)
});