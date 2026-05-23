const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wastemanagement');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error(`\n💡 Troubleshooting Tips:`);
    console.error(`1. Ensure MongoDB service is running (cmd: 'net start MongoDB')`);
    console.error(`2. Check if the port (27017) is correct`);
    console.error(`3. Check your .env file URI (currently: ${process.env.MONGO_URI || 'local default'})\n`);
    // Removed process.exit(1) to keep the server alive for error handling
  }
};

module.exports = connectDB;
