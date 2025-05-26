import { knownEmailProviders } from "../../../components/custom/utils";

export const NAME_VALIDATION = {
    regex: /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,15}$/,
    title: 'Invalid Name',
    message: "Name must start with a capital letter and be 3-15 characters long",
    required: "Name is required"
};

export const EMAIL_VALIDATION = {
    regex: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
    title: 'Invalid Email',
    message: "Please provide a valid email address",
    required: "Email is required"
};

export const SUBJECT_VALIDATION = {
    regex: /^[A-Z][\sa-zA-Z\W]{5,50}$/,
    title: 'Invalid Subject',
    message: "Subject must start with a capital letter and be 5-50 characters long",
    required: "Subject is required"
};

export const MESSAGE_VALIDATION = {
    regex: /^[A-Z][\sa-zA-Z\W]{10,200}$/,
    title: 'Invalid Message',
    message: "Message must start with a capital letter and be 10-200 characters long",
    required: "Message is required"
};