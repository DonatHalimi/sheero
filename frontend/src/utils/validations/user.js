import { knownEmailProviders } from "../../assets/CustomComponents";

export const UserValidations = {
    firstNameRules: {
        pattern: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{2,10}$/,
        title: 'Invalid First Name',
        message: "First name must start with a capital letter and be 2-10 characters long"
    },

    lastNameRules: {
        pattern: /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{2,10}$/,
        title: 'Invalid Last Name',
        message: "Last name must start with a capital letter and be 2-10 characters long"
    },

    emailRules: {
        pattern: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
        title: 'Invalid Email',
        message: "Please provide a valid email address"
    },

    passwordRules: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/,
        title: 'Invalid Password',
        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    },

    newPasswordRules: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/,
        title: 'Invalid New Password',
        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
    },

    twoFactorRules: {
        title: 'Two-Factor Authentication',
        message: "You'll need to verify an OTP code sent to your email each login for enhanced security"
    },
};