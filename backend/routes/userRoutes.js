const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers, deleteUser, getDrivers, getLeaderboard, redeemReward } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/profile').get(protect, getUserProfile);
router.route('/update').put(protect, upload.single('profilePhoto'), updateUserProfile);
router.route('/all').get(protect, admin, getUsers);
router.route('/drivers').get(protect, admin, getDrivers);
router.route('/leaderboard').get(getLeaderboard);
router.route('/redeem').post(protect, redeemReward);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;
