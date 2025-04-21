import * as yup from "yup";
import { COUNTRY_CODE_VALIDATION, NAME_VALIDATION } from "../constants/validations/country";

export const initialValues = (country = null) => ({
    name: country?.name || "",
    countryCode: country?.countryCode || "",
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    countryCode: yup
        .string()
        .matches(COUNTRY_CODE_VALIDATION.regex, COUNTRY_CODE_VALIDATION.message)
        .required(COUNTRY_CODE_VALIDATION.required)
});