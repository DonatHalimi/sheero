import * as yup from "yup";
import { NAME_VALIDATION, SUBCATEGORY_VALIDATION } from "../constants/subSubcategory";

export const initialValues = (subSubcategory = null) => ({
    name: subSubcategory?.name || "",
    subcategory: subSubcategory?.subcategory || null
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    subcategory: yup
        .object()
        .required(SUBCATEGORY_VALIDATION.required)
});