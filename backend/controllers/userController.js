const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        location: user.location,
        points: user.points || 0,
        badges: user.badges || [],
        rewardsRedeemed: user.rewardsRedeemed || [],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.location = req.body.location || user.location;

      if (req.body.password) {
        user.password = req.body.password;
      }

      // Handle profile photo upload to Cloudinary if file is provided
      if (req.file) {
        try {
          const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'ecosync/profiles' },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(req.file.buffer);
          });
          user.profilePhoto = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError);
          return res.status(500).json({ message: 'Image upload failed' });
        }
      } else if (req.body.profilePhoto) {
        // Fallback if they passed it as a string for some reason
        user.profilePhoto = req.body.profilePhoto;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto,
        location: updatedUser.location,
        points: updatedUser.points || 0,
        badges: updatedUser.badges || [],
        rewardsRedeemed: updatedUser.rewardsRedeemed || [],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error Message:', error.message);
    console.error('Update Profile Error Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/user/all
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/user/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Prevent self-deletion if needed, or just let it happen? 
    // Usually admin shouldn't delete themselves accidentally.
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Admin cannot delete themselves' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all drivers
// @route   GET /api/user/drivers
// @access  Private/Admin
const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top users by points
// @route   GET /api/user/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({ role: 'user' })
      .select('name email points badges profilePhoto location')
      .sort({ points: -1 })
      .limit(10);
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Redeem points for rewards
// @route   POST /api/user/redeem
// @access  Private
const redeemReward = async (req, res) => {
  const { rewardId, name, cost } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.points < cost) {
      return res.status(400).json({ message: 'Insufficient EcoPoints' });
    }

    user.points -= cost;

    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `ECO-JNAC-${randomHex}`;

    user.rewardsRedeemed.push({
      rewardId,
      name,
      cost,
      code,
      redeemedAt: new Date()
    });

    await user.save();

    res.json({
      message: `Successfully redeemed ${name}!`,
      points: user.points,
      rewardsRedeemed: user.rewardsRedeemed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, getUsers, deleteUser, getDrivers, getLeaderboard, redeemReward };
