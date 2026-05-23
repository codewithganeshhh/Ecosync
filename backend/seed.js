const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wastemanagement');
    console.log(`Connected to Database: ${conn.connection.host}`);

    // Seed Admin
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'EcoSync Admin',
        email: 'admin@ecosync.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Default Admin Created');
    } else {
      console.log('Admin already exists.');
    }

    // Seed Driver
    const driverExists = await User.findOne({ role: 'driver' });
    if (!driverExists) {
      await User.create({
        name: 'Vehicle Rider 01',
        email: 'driver@ecosync.com',
        password: 'driver123',
        role: 'driver',
      });
      console.log('✅ Default Driver Created');
      console.log('Email: driver@ecosync.com');
      console.log('Password: driver123');
    } else {
      console.log('Driver already exists.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
