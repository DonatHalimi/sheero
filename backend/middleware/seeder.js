const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const User = require('../models/User');
const { ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, SEED_DB } = require('../config/dotenv');

const seedRoles = async () => {
    const roles = ['user', 'admin'];

    for (const roleName of roles) {
        const existingRole = await Role.findOne({ name: roleName });

        if (!existingRole) {
            const newRole = new Role({ name: roleName });
            await newRole.save();
            console.log(`✓ Role "${roleName}" seeded successfully!`);
        } else {
            console.log(`✓ Role "${roleName}" already exists!`);
        }
    }
};

const seedAdminUser = async () => {
    const requiredEnvVars = [
        'ADMIN_FIRST_NAME',
        'ADMIN_LAST_NAME',
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD'
    ];

    const missingVars = [];

    for (let varName of requiredEnvVars) {
        if (!process.env[varName]) {
            missingVars.push(varName);
        }
    }

    if (missingVars.length > 0) {
        console.error(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
        return;
    }

    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
        console.error('⚠️  Admin role not found! Ensure roles are seeded first.');
        return;
    }

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const adminUser = new User({
            firstName: ADMIN_FIRST_NAME,
            lastName: ADMIN_LAST_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: adminRole._id,
        });

        await adminUser.save();
        console.log('✓ Admin user seeded successfully!');
    } else {
        console.log('✓ Admin user already exists!');
    }
};

const seedDB = async () => {
    if (SEED_DB === 'true') {
        console.log('🌱 Seeding database...');
        await seedRoles();
        await seedAdminUser();
        console.log('🌳 Database seeding completed.');
    }
};

module.exports = { seedRoles, seedAdminUser, seedDB };