const WasteReport = require('../models/WasteReport');
const cloudinary = require('../config/cloudinary');

// @desc    Report waste
// @route   POST /api/waste/report
// @access  Private
const reportWaste = async (req, res) => {
  const { wasteType, description, location } = req.body;
  let reportingCoordinates = req.body.reportingCoordinates;
  let imageUrl = req.body.image; // Fallback

  try {
    if (reportingCoordinates && typeof reportingCoordinates === 'string') {
      reportingCoordinates = JSON.parse(reportingCoordinates);
    }
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ecosync/waste_reports' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const report = new WasteReport({
      userId: req.user._id,
      wasteType,
      description,
      location,
      image: imageUrl,
      reportingCoordinates,
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all waste reports (Admin)
// @route   GET /api/waste/all
// @access  Private/Admin
const getAllReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({}).populate('userId', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's waste reports
// @route   GET /api/waste/myreports
// @access  Private
const getMyReports = async (req, res) => {
  try {
    const reports = await WasteReport.find({ userId: req.user._id });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get report by ID
// @route   GET /api/waste/:id
// @access  Private
const getReportById = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id).populate('userId', 'name email');

    if (report) {
      if(req.user.role !== 'admin' && report.userId._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this report' });
      }
      res.json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status
// @route   PUT /api/waste/:id/status
// @access  Private/Admin
const updateReportStatus = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);

    if (report) {
      report.status = req.body.status || report.status;
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign driver to waste report
// @route   PUT /api/waste/:id/assign
// @access  Private/Admin
const assignDriver = async (req, res) => {
  try {
    const report = await WasteReport.findById(req.params.id);
    if (report) {
      report.assignedDriver = req.body.driverId;
      report.status = 'assigned';
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports assigned to driver
// @route   GET /api/waste/assigned
// @access  Private/Driver
const getAssignedTasks = async (req, res) => {
  try {
    const reports = await WasteReport.find({ assignedDriver: req.user._id }).populate('userId', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit cleanup result (image)
// @route   PUT /api/waste/:id/submit-cleanup
// @access  Private/Driver
const submitCleanup = async (req, res) => {
  let cleanupCoordinates = req.body.cleanupCoordinates;
  let cleanedImageUrl = req.body.cleanedImage;

  try {
    if (cleanupCoordinates && typeof cleanupCoordinates === 'string') {
      cleanupCoordinates = JSON.parse(cleanupCoordinates);
    }
    const report = await WasteReport.findById(req.params.id);
    if (report) {
      if (report.assignedDriver.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized: You are not assigned to this task' });
      }

      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'ecosync/cleanups' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        cleanedImageUrl = uploadResult.secure_url;
      }

      report.cleanedImage = cleanedImageUrl;
      report.cleanupCoordinates = cleanupCoordinates;
      report.status = 'cleaned';
      const updatedReport = await report.save();
      res.json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  reportWaste, 
  getAllReports, 
  getMyReports, 
  getReportById, 
  updateReportStatus, 
  assignDriver, 
  getAssignedTasks, 
  submitCleanup 
};
