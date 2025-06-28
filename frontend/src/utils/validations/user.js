import * as yup from "yup";
import { EMAIL_VALIDATION, FIRST_NAME_VALIDATION, LAST_NAME_VALIDATION, PASSWORD_VALIDATION, ROLE_VALIDATION } from "../constants/user";

export const initialValues = (user = null) => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    role: user?.role?._id || null,
});

export const validationSchema = (isEdit = false) => yup.object().shape({
    firstName: yup
        .string()
        .matches(FIRST_NAME_VALIDATION.regex, FIRST_NAME_VALIDATION.message)
        .required(FIRST_NAME_VALIDATION.required),

    lastName: yup
        .string()
        .matches(LAST_NAME_VALIDATION.regex, LAST_NAME_VALIDATION.message)
        .required(LAST_NAME_VALIDATION.required),

    email: yup
        .string()
        .email(EMAIL_VALIDATION.message)
        .matches(EMAIL_VALIDATION.regex, EMAIL_VALIDATION.message)
        .required(EMAIL_VALIDATION.required),

    password: isEdit
        ? yup.string().notRequired()
        : yup
            .string()
            .matches(PASSWORD_VALIDATION.regex, PASSWORD_VALIDATION.message)
            .required(PASSWORD_VALIDATION.required),

    role: yup
        .string()
        .required(ROLE_VALIDATION.required),
});