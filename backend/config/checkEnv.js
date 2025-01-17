const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

class EnvValidator {
    constructor() {
        this.validators = {
            NODE_ENV: {
                validate: (value) => ['development', 'production'].includes(value),
                message: (value) => `Invalid NODE_ENV: '${value}'. Must be 'development' or 'production'`
            },
            ADMIN_FIRST_NAME: {
                validate: (value) => /^[A-Z][a-zA-Z]{1,9}$/.test(value),
                message: () => 'ADMIN_FIRST_NAME must start with a capital letter and be 2-10 characters'
            },
            ADMIN_LAST_NAME: {
                validate: (value) => /^[A-Z][a-zA-Z]{1,9}$/.test(value),
                message: () => 'ADMIN_LAST_NAME must start with a capital letter and be 2-10 characters'
            },
            ADMIN_EMAIL: {
                validate: (value) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value),
                message: () => 'Invalid email format for ADMIN_EMAIL'
            },
            ADMIN_PASSWORD: {
                validate: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*()?&])[A-Za-z\d@$!%*()?&]{8,}$/.test(value),
                message: () => 'ADMIN_PASSWORD must be at least 8 characters and include uppercase, lowercase, number, and special character'
            }
        };

        this.requiredVars = [
            'BACKEND_PORT',
            'MONGODB_URI',
            'JWT_SECRET',
            'STRIPE_SECRET_KEY',
            'NODE_ENV'
        ];
    }

    loadEnvFile() {
        const envPath = path.resolve(__dirname, '../.env');

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
        
        if (!value) {
            throw new Error(`${name} is not defined in environment variables`);
        }

        const validator = this.validators[name];
        if (validator && !validator.validate(value)) {
            throw new Error(validator.message(value));
        }

        return value;
    }

    validate() {
        try {
            if (process.env.NODE_ENV === 'production') {
                console.log('Skipping environment validation in production.');
                return;
            }

            this.loadEnvFile();

            let missingVars = [];
            this.requiredVars.forEach(name => {
                try {
                    this.validateVar(name);
                } catch (error) {
                    missingVars.push(name);
                }
            });

            const seedDb = process.env.SEED_DB === 'true';
            if (seedDb) {
                const adminVars = [
                    'ADMIN_FIRST_NAME',
                    'ADMIN_LAST_NAME',
                    'ADMIN_EMAIL',
                    'ADMIN_PASSWORD'
                ];

                adminVars.forEach(name => {
                    try {
                        this.validateVar(name);
                    } catch (error) {
                        missingVars.push(name);
                    }
                });
            }

            if (missingVars.length > 0) {
                throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
            }

            console.log('✓ Backend environment variables set correctly.');
        } catch (error) {
            console.error(`⚠️  ${error.message}`);
            process.exit(1);
        }
    }
}

new EnvValidator().validate();