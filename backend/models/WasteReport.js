const mongoose = require('mongoose');

const wasteReportSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    wasteType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Storing image as Base64 string
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cleanedImage: {
      type: String, // Base64 of cleaned site
    },
    verificationNotes: {
      type: String,
    },
    reportingCoordinates: {
      lat: Number,
      lng: Number,
    },
    cleanupCoordinates: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'cleaned', 'completed', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const WasteReport = mongoose.model('WasteReport', wasteReportSchema);

module.exports = WasteReport;
