const express = require('express');
const router = express.Router();
const { getDashboardStats, getGlobalStats } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/global', getGlobalStats);

module.exports = router;
