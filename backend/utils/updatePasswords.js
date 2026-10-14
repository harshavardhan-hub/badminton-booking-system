const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Fix for Windows / ISP DNS refusing SRV record queries for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const User = require('../models/User');

dotenv.config();

const usersToUpdate = [
  {
    name: 'Admin User',
    email: 'admin@badminton.com',
    password: 'Admin@Badminton#2026!',
    phone: '+91-9876543210',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User@Badminton#2026!',
    phone: '+91-9876543211',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User@Badminton#2026!',
    phone: '+91-9876543212',
    role: 'user'
  }
];

const updatePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    for (const userData of usersToUpdate) {
      let user = await User.findOne({ email: userData.email });
      if (user) {
        user.password = userData.password;
        user.name = userData.name;
        user.role = userData.role;
        user.phone = userData.phone;
        await user.save(); // triggers bcrypt hash in pre('save') hook
        console.log(`🔒 Updated strict password for: ${userData.email} (${userData.role})`);
      } else {
        user = await User.create(userData);
        console.log(`✨ Created new user with strict password: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\n🎉 All passwords updated successfully to strict standard!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    process.exit(1);
  }
};

updatePasswords();
