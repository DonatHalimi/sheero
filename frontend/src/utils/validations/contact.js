import { knownEmailProviders } from "../../assets/CustomComponents";

export const ContactValidations = {
    nameRules: {
        pattern: /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,15}$/,
        message: "Name must start with a capital letter and be 3-15 characters long"
    },

    emailRules: {
        pattern: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
        message: "Please provide a valid email address"
    },

    subjectRules: {
        pattern: /^[A-Z][\sa-zA-Z\W]{5,50}$/,
        message: "Subject must start with a capital letter and be 5-50 characters long"
    },

    messageRules: {
        pattern: /^[A-Z][\sa-zA-Z\W]{10,200}$/,
        message: "Message must start with a capital letter and be 10-200 characters long"
    }
};