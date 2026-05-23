const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const PickupRequest = require('../models/PickupRequest');

// @desc    Get system-wide statistics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalReports = await WasteReport.countDocuments({});
    const totalPickups = await PickupRequest.countDocuments({});

    const pendingReports = await WasteReport.countDocuments({ status: 'pending' });
    const assignedReports = await WasteReport.countDocuments({ status: 'assigned' });
    const cleanedReports = await WasteReport.countDocuments({ status: 'cleaned' });
    const completedReports = await WasteReport.countDocuments({ status: 'completed' });

    const pendingPickups = await PickupRequest.countDocuments({ status: 'pending' });
    const completedPickups = await PickupRequest.countDocuments({ status: 'completed' });

    // Simple waste type breakdown
    const wasteTypes = await WasteReport.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } }
    ]);

    // Driver Load Stats (Active tasks per driver)
    const fleetLoad = await WasteReport.aggregate([
      { $match: { status: 'assigned' } },
      { $group: { _id: "$assignedDriver", activeTasks: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalReports,
      totalPickups,
      pendingReports,
      assignedReports,
      cleanedReports,
      completedReports,
      pendingPickups,
      completedPickups,
      wasteTypes,
      fleetLoad
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
