import { knownEmailProviders } from "../../components/custom/utils";

export const NAME_VALIDATION = {
    regex: /^[A-Z][\sa-zA-Z\W]{3,15}$/,
    message: "Name must start with a capital letter and be 3-15 characters long",
    required: "Name is required"
};

export const EMAIL_VALIDATION = {
    regex: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
    message: "Please provide a valid email address",
    required: "Email is required"
};

export const PHONE_NUMBER_VALIDATION = {
    regex: /^0(43|44|45|46|47|48|49)\d{6}$/,
    message: "Phone number start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits",
    required: "Phone number is required"
};