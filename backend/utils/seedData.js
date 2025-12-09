const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const Equipment = require('../models/Equipment');
const PricingRule = require('../models/PricingRule');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Court.deleteMany();
    await Coach.deleteMany();
    await Equipment.deleteMany();
    await PricingRule.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@badminton.com',
      password: 'admin123',
      phone: '+91-9876543210',
      role: 'admin'
    });

    // Create Regular Users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+91-9876543211',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+91-9876543212',
        role: 'user'
      }
    ]);

    console.log('✅ Created users');

    // Create Courts
    const courts = await Court.create([
      {
        name: 'Indoor Court 1',
        type: 'indoor',
        basePrice: 500,
        description: 'Premium indoor court with air conditioning',
        features: ['AC', 'LED Lighting', 'Professional Flooring']
      },
      {
        name: 'Indoor Court 2',
        type: 'indoor',
        basePrice: 500,
        description: 'Premium indoor court with air conditioning',
        features: ['AC', 'LED Lighting', 'Professional Flooring']
      },
      {
        name: 'Outdoor Court 1',
        type: 'outdoor',
        basePrice: 300,
        description: 'Standard outdoor court',
        features: ['Natural Lighting', 'Good Ventilation']
      },
      {
        name: 'Outdoor Court 2',
        type: 'outdoor',
        basePrice: 300,
        description: 'Standard outdoor court',
        features: ['Natural Lighting', 'Good Ventilation']
      }
    ]);

    console.log('✅ Created courts');

    // Create Coaches
    const coaches = await Coach.create([
      {
        name: 'Coach Ravi Kumar',
        email: 'ravi@badminton.com',
        phone: '+91-9876543220',
        specialization: 'Advanced Training',
        hourlyRate: 800,
        bio: 'National level player with 10 years coaching experience',
        experience: 10,
        availability: [
          { dayOfWeek: 1, startTime: '06:00', endTime: '10:00' },
          { dayOfWeek: 1, startTime: '16:00', endTime: '20:00' },
          { dayOfWeek: 3, startTime: '06:00', endTime: '10:00' },
          { dayOfWeek: 3, startTime: '16:00', endTime: '20:00' },
          { dayOfWeek: 5, startTime: '06:00', endTime: '10:00' },
          { dayOfWeek: 5, startTime: '16:00', endTime: '20:00' }
        ]
      },
      {
        name: 'Coach Priya Sharma',
        email: 'priya@badminton.com',
        phone: '+91-9876543221',
        specialization: 'Beginner & Intermediate',
        hourlyRate: 600,
        bio: 'Certified coach specializing in youth training',
        experience: 7,
        availability: [
          { dayOfWeek: 2, startTime: '07:00', endTime: '11:00' },
          { dayOfWeek: 2, startTime: '17:00', endTime: '21:00' },
          { dayOfWeek: 4, startTime: '07:00', endTime: '11:00' },
          { dayOfWeek: 4, startTime: '17:00', endTime: '21:00' },
          { dayOfWeek: 6, startTime: '08:00', endTime: '12:00' }
        ]
      },
      {
        name: 'Coach Amit Patel',
        email: 'amit@badminton.com',
        phone: '+91-9876543222',
        specialization: 'All Levels',
        hourlyRate: 700,
        bio: 'Former state champion with 8 years coaching experience',
        experience: 8,
        availability: [
          { dayOfWeek: 0, startTime: '08:00', endTime: '13:00' },
          { dayOfWeek: 6, startTime: '08:00', endTime: '13:00' }
        ]
      }
    ]);

    console.log('✅ Created coaches');

    // Create Equipment
    const equipment = await Equipment.create([
      {
        name: 'Yonex Racket',
        type: 'racket',
        totalQuantity: 20,
        pricePerHour: 100,
        description: 'Professional grade badminton racket'
      },
      {
        name: 'Li-Ning Racket',
        type: 'racket',
        totalQuantity: 15,
        pricePerHour: 80,
        description: 'Intermediate level badminton racket'
      },
      {
        name: 'Badminton Shoes',
        type: 'shoes',
        totalQuantity: 30,
        pricePerHour: 50,
        description: 'Non-marking badminton shoes (various sizes)'
      }
    ]);

    console.log('✅ Created equipment');

    // Create Pricing Rules
    const pricingRules = await PricingRule.create([
      {
        name: 'Peak Hour Premium',
        description: 'Higher rates during peak hours (6 PM - 9 PM)',
        type: 'peak_hour',
        conditions: {
          startTime: '18:00',
          endTime: '21:00'
        },
        modifier: {
          type: 'percentage',
          value: 50
        },
        priority: 1
      },
      {
        name: 'Weekend Surcharge',
        description: 'Weekend premium pricing',
        type: 'weekend',
        conditions: {
          days: [0, 6] // Sunday and Saturday
        },
        modifier: {
          type: 'percentage',
          value: 30
        },
        priority: 2
      },
      {
        name: 'Indoor Court Premium',
        description: 'Premium pricing for indoor courts',
        type: 'court_type',
        conditions: {
          courtType: 'indoor'
        },
        modifier: {
          type: 'fixed',
          value: 100
        },
        priority: 3
      },
      {
        name: 'Early Morning Discount',
        description: 'Discount for early morning bookings (6 AM - 8 AM)',
        type: 'peak_hour',
        conditions: {
          startTime: '06:00',
          endTime: '08:00'
        },
        modifier: {
          type: 'percentage',
          value: -20
        },
        priority: 4
      }
    ]);

    console.log('✅ Created pricing rules');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@badminton.com / admin123');
    console.log('User: john@example.com / password123');
    console.log('User: jane@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

connectDB().then(() => seedData());
