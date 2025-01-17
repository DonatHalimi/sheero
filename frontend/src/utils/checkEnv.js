import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

if (process.env.NODE_ENV === 'production') {
    console.log('Skipping environment check in production.');
    process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFilePath = path.resolve(__dirname, '../../.env');

if (!fs.existsSync(envFilePath)) {
    console.error(`⚠️  .env file not found at: ${envFilePath}`);
    console.error('Please create the .env file with the required environment variables.');
    console.error('Follow the instructions on how to create the .env file in the README.md in the root directory (## Installation > Step 4).');
    process.exit(1);
}

dotenv.config({ path: envFilePath });

const checkEnvVars = (requiredVars) => {
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        const variableLabel = missingVars.length === 1 ? 'variable' : 'variables';
        console.error(`⚠️  Missing environment ${variableLabel} in frontend/.env: ${missingVars.join(', ')}`);
        console.error('Please check your .env file and ensure the missing variables are defined.');
        console.log(`You can find the .env file at: ${envFilePath}`);
        process.exit(1);
    }

    const validNodeEnvValues = ['development', 'production'];
    const nodeEnv = process.env.NODE_ENV;

    if (nodeEnv && !validNodeEnvValues.includes(nodeEnv)) {
        console.error(`⚠️  Invalid value for NODE_ENV: '${nodeEnv}'. It must be either 'development' or 'production'.`);
        process.exit(1);
    }

    console.log('✓ Frontend environment variables set correctly.');
};

const requiredEnvVars = ['NODE_ENV'];

checkEnvVars(requiredEnvVars);