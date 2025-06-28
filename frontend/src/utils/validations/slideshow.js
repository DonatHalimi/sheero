import * as yup from "yup";
import { DESCRIPTION_VALIDATION, IMAGE_VALIDATION, TITLE_VALIDATION } from "../constants/slideshow";

export const initialValues = (slideshow = null) => ({
    title: slideshow?.title || "",
    image: slideshow?.image || null,
    description: slideshow?.description || "",
});

export const validationSchema = yup.object().shape({
    title: yup
        .string()
        .matches(TITLE_VALIDATION.regex, TITLE_VALIDATION.message)
        .required(TITLE_VALIDATION.required),

    image: yup
        .mixed()
        .required(IMAGE_VALIDATION.required),

    description: yup
        .string()
        .matches(DESCRIPTION_VALIDATION.regex, DESCRIPTION_VALIDATION.message)
        .required(DESCRIPTION_VALIDATION.required)
});