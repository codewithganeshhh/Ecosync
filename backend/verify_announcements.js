const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Announcement = require('./models/Announcement');
const User = require('./models/User');

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Find an admin user to associate
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.log('No admin user found! Please register an admin first.');
      mongoose.connection.close();
      process.exit(0);
    }
    console.log(`Found Admin: ${admin.name} (${admin._id})`);

    // Clean up
    await Announcement.deleteMany({});
    console.log('Cleared existing announcements');

    // Create a new announcement
    const newAnn = await Announcement.create({
      message: 'Weather Alert: Rain in Mango may delay afternoon pickup schedules',
      type: 'warning',
      isActive: true,
      createdBy: admin._id
    });
    console.log('Created Announcement:', newAnn);

    // Fetch active
    const active = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
    console.log('Active Announcement:', active);

    // Clear
    await Announcement.updateMany({ isActive: true }, { isActive: false });
    console.log('Cleared active announcements');

    // Fetch active again
    const active2 = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
    console.log('Active Announcement after clearing:', active2);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
