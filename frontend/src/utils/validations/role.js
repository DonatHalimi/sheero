import * as yup from "yup";
import { DESCRIPTION_VALIDATION, NAME_VALIDATION } from "../constants/validations/role";

export const initialValues = (role = null) => ({
    name: role?.name || "",
    description: role?.description || "",
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    description: yup
        .string()
        .matches(DESCRIPTION_VALIDATION.regex, DESCRIPTION_VALIDATION.message)
        .required(DESCRIPTION_VALIDATION.required)
});