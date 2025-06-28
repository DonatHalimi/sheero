import * as yup from "yup";
import { CHECKBOX_VALIDATION, CUSTOM_REASON_VALIDATION, REASON_VALIDATION, SELECTED_PRODUCTS_VALIDATION, STATUS_VALIDATION } from "../constants/return";

export const initialValues = (returnRequest = null) => ({
    status: returnRequest?.status || '',
});

export const validationSchema = yup.object().shape({
    status: yup
        .string()
        .oneOf(STATUS_VALIDATION.options, STATUS_VALIDATION.message)
        .required(STATUS_VALIDATION.required),
});

export const returnModalInitialValues = (orderProducts = []) => ({
    selectedProducts: orderProducts.length > 0 ? orderProducts.map(({ product }) => product._id) : [],
    reason: '',
    customReason: '',
    confirmSelection: false
});

export const returnModalValidationSchema = yup.object().shape({
    selectedProducts: yup
        .array()
        .min(1, SELECTED_PRODUCTS_VALIDATION.message)
        .required(SELECTED_PRODUCTS_VALIDATION.required),

    reason: yup
        .string()
        .required(REASON_VALIDATION.required),

    customReason: yup
        .string()
        .when('reason', {
            is: 'Other',
            then: (schema) => schema
                .required(CUSTOM_REASON_VALIDATION.required)
                .matches(CUSTOM_REASON_VALIDATION.regex, CUSTOM_REASON_VALIDATION.message),
        }),

    confirmSelection: yup
        .boolean()
        .oneOf([true], CHECKBOX_VALIDATION.message)
        .required(CHECKBOX_VALIDATION.required)
});
