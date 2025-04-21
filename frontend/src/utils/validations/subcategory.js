import * as yup from "yup";
import { CATEGORY_VALIDATION, IMAGE_VALIDATION, NAME_VALIDATION } from "../constants/validations/subcategory";

export const initialValues = (subcategory = null) => ({
    name: subcategory?.name || "",
    image: subcategory?.image || null,
    category: subcategory?.category || null
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    image: yup
        .mixed()
        .required(IMAGE_VALIDATION.required),

    category: yup
        .object()
        .required(CATEGORY_VALIDATION.required)
});