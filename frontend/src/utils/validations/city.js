import * as yup from "yup";
import { COUNTRY_VALIDATION, NAME_VALIDATION, ZIP_CODE_VALIDATION } from "../constants/city";

export const initialValues = (city = null) => ({
    name: city?.name || "",
    country: city?.country || "",
    zipCode: city?.zipCode || "",
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    country: yup
        .object()
        .required(COUNTRY_VALIDATION.required),

    zipCode: yup
        .string()
        .matches(ZIP_CODE_VALIDATION.regex, ZIP_CODE_VALIDATION.message)
        .required(ZIP_CODE_VALIDATION.required)
});