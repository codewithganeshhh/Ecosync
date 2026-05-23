const express = require('express');
const router = express.Router();
const { requestPickup, getAllPickups, getMyPickups, updatePickupStatus } = require('../controllers/pickupController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/request', protect, requestPickup);
router.get('/all', protect, admin, getAllPickups);
router.get('/mypickups', protect, getMyPickups);
router.put('/:id/status', protect, admin, updatePickupStatus);

module.exports = router;
