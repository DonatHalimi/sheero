const bcrypt = require('bcryptjs');
const Role = require('../models/Role');
const User = require('../models/User');
const { SEED_DB } = require('../config/core/dotenv');

const roles = [
  { name: 'admin', description: 'Full access to everything.' },
  { name: 'user', description: 'Default role for all registered users.' },
  { name: 'productManager', description: 'Manages reviews, products, categories, subcategories, product restock subscriptions and suppliers. Can create, read, update and delete each one of them.' },
  { name: 'contentManager', description: 'Manages slideshow images and FAQs. Can create, read, update and delete each one of them.' },
  { name: 'orderManager', description: 'Manages all orders. Can view and update order statuses in the dashboard page. Receives email notifications and real-time system notifications whenever a new order is placed.' },
  { name: 'customerSupport', description: `Receives emails from the 'Contact Us' form. Can view and delete contact messages in the dashboard page.` },
];

const getUserEnvVars = (role) => {
  const prefix = role.replace(/([A-Z])/g, '_$1').toUpperCase();
  return {
    firstName: process.env[`${prefix}_FIRST_NAME`],
    lastName: process.env[`${prefix}_LAST_NAME`],
    email: process.env[`${prefix}_EMAIL`],
    password: process.env[`${prefix}_PASSWORD`]
  };
};

const seedRoles = async () => {
  for (const roleData of roles) {
    const existingRole = await Role.findOne({ name: roleData.name });
    if (!existingRole) {
      const newRole = new Role({
        name: roleData.name,
        description: roleData.description
      });
      await newRole.save();
      console.log(`☑ Role "${roleData.name}" seeded successfully`);
    } else {
      console.log(`✓ Role "${roleData.name}" already exists`);
    }
  }
};

const seedUsers = async () => {
  for (const roleData of roles) {
    const { firstName, lastName, email, password } = getUserEnvVars(roleData.name);

    if (!firstName || !lastName || !email || !password) {
      console.warn(`⚠️  Missing .env values for ${roleData.name} user`);
      continue;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`✓ ${roleData.name} user already exists`);
      continue;
    }

    const roleDoc = await Role.findOne({ name: roleData.name });
    if (!roleDoc) {
      console.warn(`⚠️  Role "${roleData.name}" not found`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: roleDoc._id,
    });

    await newUser.save();
    console.log(`☑ ${roleData.name} user created successfully`);
  }
};

const seedDB = async () => {
  if (SEED_DB === 'true') {
    console.log('🌱 Seeding database...');
    await seedRoles();
    await seedUsers();
    console.log('🌳 Database seeding completed.');
  }
};

module.exports = { seedDB };