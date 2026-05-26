const WasteReport = require('../models/WasteReport');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
    
    let aiAnalysis = req.body.aiAnalysis;
    if (aiAnalysis && typeof aiAnalysis === 'string') {
      aiAnalysis = JSON.parse(aiAnalysis);
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
      aiAnalysis,
    });

    const createdReport = await report.save();

    // Award +10 points to reporter
    const user = await User.findById(req.user._id);
    if (user) {
      user.points = (user.points || 0) + 10;
      await user.save();
    }

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
      const oldStatus = report.status;
      report.status = req.body.status || report.status;
      const updatedReport = await report.save();

      // If status changed to completed, award +25 points and check badges
      if (req.body.status === 'completed' && oldStatus !== 'completed') {
        const reporter = await User.findById(report.userId);
        if (reporter) {
          reporter.points = (reporter.points || 0) + 25;

          const currentBadges = reporter.badges || ['Eco Starter'];
          if (reporter.points >= 50 && !currentBadges.includes('Eco Hero')) {
            currentBadges.push('Eco Hero');
          }
          if (reporter.points >= 100 && !currentBadges.includes('Green Guardian')) {
            currentBadges.push('Green Guardian');
          }
          if (reporter.points >= 250 && !currentBadges.includes('Green Ambassador')) {
            currentBadges.push('Green Ambassador');
          }
          reporter.badges = currentBadges;
          await reporter.save();
        }
      }

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

// @desc    Analyze waste image using Gemini API or simulate fallback
// @route   POST /api/waste/analyze
// @access  Private
const analyzeWasteImage = async (req, res) => {
  try {
    // If Gemini API Key is configured and a file was uploaded, perform real analysis
    if (process.env.GEMINI_API_KEY && req.file) {
      try {
        console.log(`[AI Scanner] Analyzing uploaded image using Google Gemini API (${req.file.size} bytes)...`);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const imagePart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: req.file.mimetype,
          },
        };

        const prompt = `Analyze this image of reported waste. Identify the types of waste visible and categorise the primary waste type into exactly one of: 'plastic', 'organic', 'electronic', 'hazardous', or 'general'. 
Provide a descriptive summary of the trash seen.
Estimate the total weight of the waste in kilograms (number between 1 and 100).
Evaluate how recyclable it is (recyclabilityPercentage as number between 0 and 100).
Estimate carbon saved in kg by recycling it (carbonSavedKg as a number, calculated roughly as: weight * (recyclabilityPercentage / 100) * 0.45, rounded to 1 decimal place).

Return ONLY a JSON object matching this structure:
{
  "wasteType": "plastic" | "organic" | "electronic" | "hazardous" | "general",
  "description": "AI Assist: Identified [detailed description of waste objects seen]",
  "aiAnalysis": {
    "isRecyclable": boolean,
    "recyclabilityPercentage": number,
    "estimatedWeightKg": number,
    "carbonSavedKg": number
  }
}`;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        const data = JSON.parse(text);

        console.log('[AI Scanner] Gemini analysis successful:', data);
        return res.json(data);
      } catch (geminiError) {
        console.error('[AI Scanner] Gemini API execution failed, falling back to simulation:', geminiError);
      }
    }

    // Fallback simulated logic (if key not configured or API call failed)
    console.log('[AI Scanner] Running simulated waste analysis...');
    const wasteCategories = ['plastic', 'organic', 'electronic', 'hazardous', 'general'];
    const selectedCategory = wasteCategories[Math.floor(Math.random() * wasteCategories.length)];

    const aiDescriptions = {
      plastic: 'single-use plastic bottles, containers, and packaging wrappers accumulating in the area.',
      organic: 'kitchen food scraps, vegetable residues, and garden clippings generating odor.',
      electronic: 'computer peripherals, old power cables, battery packs, and electronics.',
      hazardous: 'chemical cleaning containers, paint residues, and fluorescent glass tubes needing containment.',
      general: 'miscellaneous household dry debris, paperboards, and fabric waste scraps.'
    };

    const recyclabilityPercentage = selectedCategory === 'plastic' ? 85 :
                                   selectedCategory === 'electronic' ? 70 :
                                   selectedCategory === 'organic' ? 95 :
                                   selectedCategory === 'general' ? 45 : 10;

    const estimatedWeightKg = Math.floor(Math.random() * 25) + 3; // 3 to 28 kg
    const carbonSavedKg = parseFloat((estimatedWeightKg * (recyclabilityPercentage / 100) * 0.45).toFixed(1));

    res.json({
      wasteType: selectedCategory,
      description: `AI Assist (Simulation): Identified ${aiDescriptions[selectedCategory]}`,
      aiAnalysis: {
        isRecyclable: recyclabilityPercentage > 30,
        recyclabilityPercentage,
        estimatedWeightKg,
        carbonSavedKg
      }
    });
  } catch (error) {
    console.error('[AI Scanner] Critical error in analyzeWasteImage:', error);
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
  submitCleanup,
  analyzeWasteImage
};
