const express = require('express');
const router = express.Router();
const {
  getActiveAnnouncement,
  createAnnouncement,
  clearActiveAnnouncements,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/active', protect, getActiveAnnouncement);
router.post('/', protect, admin, createAnnouncement);
router.put('/clear', protect, admin, clearActiveAnnouncements);

module.exports = router;
