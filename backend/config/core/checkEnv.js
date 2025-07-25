const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

class EnvValidator {
    constructor() {
        this.roles = [
            'ADMIN',
            'USER',
            'CUSTOMER_SUPPORT',
            'ORDER_MANAGER',
            'CONTENT_MANAGER',
            'PRODUCT_MANAGER',
        ];

        this.requiredVars = [
            'BACKEND_PORT',
            'MONGODB_URI',
            'JWT_SECRET',
            'STRIPE_SECRET_KEY',
            'NODE_ENV',
            'SESSION_SECRET',
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'FACEBOOK_CLIENT_ID',
            'FACEBOOK_CLIENT_SECRET',
            'SMTP_USER',
            'SMTP_PASS',
        ];

        this.validators = {
            NODE_ENV: {
                validate: (val) => ['development', 'production'].includes(val),
                message: (val) => `Invalid NODE_ENV: '${val}'. Must be 'development' or 'production'`
            }
        };

        this.roles.forEach(role => {
            ['FIRST_NAME', 'LAST_NAME'].forEach(field => {
                const key = `${role}_${field}`;
                this.validators[key] = {
                    validate: (val) => /^[A-Z][a-zA-Z]{1,9}$/.test(val),
                    message: () => `${key} must start with a capital letter and be 2–10 characters long`
                };
            });

            this.validators[`${role}_EMAIL`] = {
                validate: (val) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val),
                message: () => `${role}_EMAIL is not a valid email format`
            };

            this.validators[`${role}_PASSWORD`] = {
                validate: (val) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*()?&])[A-Za-z\d@$!%*()?&]{8,}$/.test(val),
                message: () =>
                    `${role}_PASSWORD must be at least 8 characters and include uppercase, lowercase, number, and special character`
            };
        });
    }

    loadEnvFile() {
        const envPath = path.resolve(__dirname, '../../.env');

        if (!fs.existsSync(envPath)) {
            throw new Error([
                '.env file not found!',
                'Please create the .env file with required environment variables.',
                'The .env file should be located in the root of the backend directory (e.g. backend/.env).',
                'Follow the instructions on how to create the .env file in the README.md in the root directory (## Installation > Step 4).'
            ].join('\n'));
        }

        dotenv.config({ path: envPath });
    }

    validateVar(name) {
        const value = process.env[name];
        if (!value) throw new Error(`${name} is not defined in environment variables`);

        const validator = this.validators[name];
        if (validator && !validator.validate(value)) throw new Error(validator.message(value));
    }

    validate() {
        try {
            if (process.env.NODE_ENV === 'production') {
                console.log('Skipping environment validation in production.');
                return;
            }

            this.loadEnvFile();

            const missingVars = [];

            for (const name of this.requiredVars) {
                try {
                    this.validateVar(name);
                } catch (err) {
                    missingVars.push(name);
                }
            }

            const seedDb = process.env.SEED_DB === 'true';
            if (seedDb) {
                for (const role of this.roles) {
                    ['FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PASSWORD'].forEach(field => {
                        const key = `${role}_${field}`;
                        try {
                            this.validateVar(key);
                        } catch (err) {
                            missingVars.push(key);
                        }
                    });
                }
            }

            if (missingVars.length > 0) throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);

            console.log('✓ Backend environment variables set correctly.');
        } catch (error) {
            console.error(`⚠️  ${error.message}`);
            process.exit(1);
        }
    }
}

new EnvValidator().validate();