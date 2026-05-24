const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'driver'],
      default: 'user',
    },
    profilePhoto: {
      type: String, // Base64
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: ['Eco Starter'],
    },
    rewardsRedeemed: [
      {
        rewardId: String,
        name: String,
        cost: Number,
        code: String,
        redeemedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
