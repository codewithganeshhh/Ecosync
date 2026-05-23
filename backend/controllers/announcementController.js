const Announcement = require('../models/Announcement');

// @desc    Get active city-wide announcement
// @route   GET /api/announcements/active
// @access  Private
const getActiveAnnouncement = async (req, res) => {
  try {
    const activeAnnouncement = await Announcement.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.json(activeAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new broadcast announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { message, type } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Announcement message is required' });
    }

    // Set all other announcements to inactive
    await Announcement.updateMany({ isActive: true }, { isActive: false });

    // Create the new announcement
    const announcement = await Announcement.create({
      message,
      type: type || 'info',
      isActive: true,
      createdBy: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear active announcements
// @route   PUT /api/announcements/clear
// @access  Private/Admin
const clearActiveAnnouncements = async (req, res) => {
  try {
    await Announcement.updateMany({ isActive: true }, { isActive: false });
    res.json({ message: 'All announcements cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActiveAnnouncement,
  createAnnouncement,
  clearActiveAnnouncements,
};
