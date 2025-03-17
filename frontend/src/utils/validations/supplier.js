import { knownEmailProviders } from "../../assets/CustomComponents";

export const SupplierValidations = {
    nameRules: {
        pattern: /^[A-Z][\sa-zA-Z\W]{3,15}$/,
        message: "Name must start with a capital letter and be 3-15 characters long"
    },

    emailRules: {
        pattern: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
        message: "Please provide a valid email address"
    },

    phoneRules: {
        pattern: /^0(43|44|45|46|47|48|49)\d{6}$/,
        message: "Phone number start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits"
    },
};