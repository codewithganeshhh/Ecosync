const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  location: { type: String, default: '' }
});

// EXACT same hook as our User.js
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const TestUser = mongoose.model('TestUser', userSchema);

async function test() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test_debug';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const u = new TestUser({ password: 'hello' });
    await u.save();
    console.log('Initial save OK');
    
    u.location = 'Jamshedpur';
    await u.save();
    console.log('Location update OK:', u.location);
    
    await mongoose.disconnect();
    console.log('ALL TESTS PASSED');
  } catch(e) {
    console.error('ERROR:', e.message);
    console.error('STACK:', e.stack);
    process.exit(1);
  }
}

test();
