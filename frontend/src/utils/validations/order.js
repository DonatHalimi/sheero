import * as yup from "yup";
import { STATUS_VALIDATION } from "../constants/order";

export const initialValues = (order = null) => ({
    status: order?.status || '',
});

export const validationSchema = yup.object().shape({
    status: yup
        .string()
        .oneOf(STATUS_VALIDATION.options, STATUS_VALIDATION.message)
        .required(STATUS_VALIDATION.required),
});