import * as yup from "yup";
import { IMAGE_VALIDATION, NAME_VALIDATION } from "../constants/category";

export const initialValues = (category = null) => ({
    name: category?.name || "",
    image: category?.image || null,
});

export const validationSchema = yup.object().shape({
    name: yup
        .string()
        .matches(NAME_VALIDATION.regex, NAME_VALIDATION.message)
        .required(NAME_VALIDATION.required),

    image: yup
        .mixed()
        .required(IMAGE_VALIDATION.required)
});