import { knownEmailProviders } from "../../components/custom/utils";

export const FIRST_NAME_VALIDATION = {
    regex: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{2,10}$/,
    title: 'Invalid First Name',
    message: "First name must start with a capital letter and be 2-10 characters long",
    required: "First name is required"
};

export const LAST_NAME_VALIDATION = {
    regex: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{2,10}$/,
    title: 'Invalid Last Name',
    message: "Last name must start with a capital letter and be 2-10 characters long",
    required: "Last name is required"
};

export const EMAIL_VALIDATION = {
    regex: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
    title: 'Invalid Email',
    message: "Please provide a valid email address",
    required: "Email is required"
};

export const PASSWORD_VALIDATION = {
    regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.^#])[A-Za-z\d@$!%*?&\(\)_\+\-.^#]{8,}$/,
    title: 'Invalid Password',
    message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    required: "Password is required"
};

export const ROLE_VALIDATION = {
    required: "Role is required"
};

export const TWO_FACTOR_VALIDATION = {
    title: 'Two-Factor Authentication',
    message: "You'll need to verify an OTP code sent to your email or authenticator app each login for enhanced security"
};

export const LOGIN_NOTIFICATIONS_VALIDATION = {
    title: 'Login Notifications',
    message: "You'll be notified via email on each login to your account for enhanced security"
};