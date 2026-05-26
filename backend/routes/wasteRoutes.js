const express = require('express');
const router = express.Router();
const { 
  reportWaste, 
  getAllReports, 
  getMyReports, 
  getReportById, 
  updateReportStatus,
  assignDriver,
  getAssignedTasks,
  submitCleanup,
  analyzeWasteImage
} = require('../controllers/wasteController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const driverOnly = (req, res, next) => {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a driver' });
  }
};

router.post('/report', protect, upload.single('image'), reportWaste);
router.post('/analyze', protect, upload.single('image'), analyzeWasteImage);
router.get('/all', protect, admin, getAllReports);
router.get('/myreports', protect, getMyReports);
router.get('/assigned', protect, driverOnly, getAssignedTasks);
router.get('/:id', protect, getReportById);
router.put('/:id/status', protect, admin, updateReportStatus);
router.put('/:id/assign', protect, admin, assignDriver);
router.put('/:id/submit-cleanup', protect, driverOnly, upload.single('cleanedImage'), submitCleanup);

module.exports = router;
