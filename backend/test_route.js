const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Load the actual User model
const User = require('./models/User');
// Load actual auth middleware
const { protect } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json({ limit: '30mb' }));

// Test route using actual protect middleware
app.put('/api/user/update', protect, async (req, res) => {
  try {
    console.log('Reached route handler, user:', req.user?._id);
    const user = await User.findById(req.user._id);
    if (user) {
      user.location = req.body.location || user.location;
      const updated = await user.save();
      res.json({ location: updated.location, ok: true });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch(e) {
    console.error('ROUTE ERROR:', e.message, e.stack);
    res.status(500).json({ message: e.message });
  }
});

async function test() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wastemanagement');
  console.log('DB connected');
  
  // Create a test user manually
  const u = await User.create({ name: 'Test Debug', email: 'debug_route_test@test.com', password: 'plainpass' });
  const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });
  console.log('Test user created, token:', token.substring(0, 20) + '...');
  
  const server = app.listen(9997, async () => {
    const http = require('http');
    const data = JSON.stringify({ location: 'Jamshedpur Test' });
    const options = {
      hostname: 'localhost', port: 9997, path: '/api/user/update', method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data), 'Authorization': 'Bearer ' + token }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', async () => {
        console.log('Status:', res.statusCode, 'Body:', body);
        await User.deleteOne({ email: 'debug_route_test@test.com' });
        await mongoose.disconnect();
        server.close();
      });
    });
    req.on('error', e => console.error('Request error:', e));
    req.write(data);
    req.end();
  });
}

test().catch(e => { console.error('TEST SETUP ERROR:', e.message); process.exit(1); });
